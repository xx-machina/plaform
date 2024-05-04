import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { keymap, KeyBinding } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { graphql } from 'cm6-graphql';
import { basicSetup, EditorView } from "codemirror"
import { ReplaySubject, combineLatest, distinctUntilChanged, filter, map, shareReplay, startWith, tap } from 'rxjs';
import { AbstractControl, FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '@ng-atomic/components/extras/editor';

export class GraphqlExtractor {
  extract(output: string): string {
    return output.split('```')?.[1]?.replace(/^graphql/, '')?.replace(/^\n/, '') ?? ''
  }

  insert(query: string): string {
    return `\`\`\`graphql\n${query}\`\`\``;
  }
}

export enum ActionId {
  EXECUTE = 'execute',
  SAVE = 'save',
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    EditorComponent,
  ],
  selector: 'organisms-graphql-editor',
  template: `<extras-editor [state]="state$ | async"></extras-editor>`,
  styleUrls: ['./graphql-editor.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphqlEditorOrganism {
  // private readonly extractor = new GraphqlExtractor();
  private readonly value$ = new ReplaySubject<string>(1);
  private readonly schema$ = new ReplaySubject(1);
  private stop = false;

  state!: EditorState;
  state$ = combineLatest({
    schema: this.schema$,
    value: this.value$.pipe(
      distinctUntilChanged(),
      filter(() => !this.stop),
    ),
  }).pipe(
    filter(({schema}) => !!schema),
    map(params => this.makeEditorState(params)),
    shareReplay(1),
  );

  private readonly _control = new FormControl('');

  @Input()
  control: AbstractControl = new FormControl('');

  @Input()
  set schema(value: any) {
    this.schema$.next(value);
  }

  @Input()
  keyActions: {key: string, actionId: string}[] = [];

  @Output()
  action = new EventEmitter<Action>();

  ngOnInit() {
    this.state$.subscribe(state => this.state = state);
    this.control.valueChanges.pipe(
      startWith(this.control.value),
    ).subscribe(value => {
      this.value$.next(value);
      // this.value$.next(this.extractor.extract(value));
    });
  }

  private setValue(doc: string) {
    this.stop = true;
    // this.control.setValue(this.extractor.insert(doc));
    this.control.setValue(doc);
    this.stop = false;
  }

  makeEditorState({schema, value}: {schema: any, value: string}) {
    console.debug('schema:', schema);
    return EditorState.create({
      doc: value,
      extensions: [
        keymap.of([
          ...this.keyActions.map(({key, actionId}) => ({
            key,
            run: () => (this.action.emit({id: actionId}), true),
          })),
          indentWithTab,
        ]),
        basicSetup,
        EditorView.updateListener.of((update) => this.setValue(update.state.doc.toString())),
        bracketMatching(),
        closeBrackets(),
        history(),
        autocompletion(),
        lineNumbers(),
        oneDark,
        syntaxHighlighting(oneDarkHighlightStyle),
        graphql(schema, {
          onShowInDocs(field, type, parentType) {
            alert(
              `Showing in docs.: Field: ${field}, Type: ${type}, ParentType: ${parentType}`,
            );
          },
          onFillAllFields(view, schema, _query, cursor, token) {
            alert(`Filling all fields. Token: ${token}`);
          },
        }),
      ],
    });
  }

  private execute() {
    this.action.emit({id: ActionId.EXECUTE});
  }
}
