import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { graphql } from 'cm6-graphql';
import { basicSetup, EditorView } from "codemirror"
import { ReplaySubject, combineLatest, distinctUntilChanged, filter, startWith, tap } from 'rxjs';
import { AbstractControl, FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '@ng-atomic/components/extras/editor';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';

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
  template: `<extras-editor *ngIf="state" [state]="state"></extras-editor>`,
  styleUrls: ['./graphql-editor.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphqlEditorOrganism extends NgAtomicComponent {
  private readonly schema$ = new ReplaySubject(1);

  @Input()
  control = new FormControl('');

  state!: EditorState;

  @Input()
  set schema(value: any) {
    this.schema$.next(value);
  }

  @Input()
  keyActions: {key: string, actionId: string}[] = [];

  @Output()
  action = new EventEmitter<Action>();

  ngOnInit() {
    combineLatest({
      schema: this.schema$,
      value: this.control.valueChanges.pipe(
        startWith(this.control.value),
        filter(value => value !== this.state?.doc?.toString()),
      ),
    }).pipe(
      filter(({schema}) => !!schema),
      distinctUntilChanged(),
    ).subscribe(params => {
      console.debug('params:', params);
      this.state = this.makeEditorState(params);
    });
  }

  private makeEditorState({schema, value}: {schema: any, value: string}) {
    return EditorState.create({
      doc: value,
      extensions: [
        makeKeymapExtension(this.keyActions, action => this.dispatch(action)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) return;
          this.control.setValue(update.state.doc.toString());
        }),
        ...CODEMIRROR_EXTENSIONS,
        makeGraphqlExtension(schema),
      ],
    });
  }
}

const CODEMIRROR_EXTENSIONS = [
  basicSetup,
  bracketMatching(),
  closeBrackets(),
  history(),
  autocompletion(),
  lineNumbers(),
  oneDark,
  syntaxHighlighting(oneDarkHighlightStyle),
];

function makeKeymapExtension(
  keyActions: {key: string, actionId: string}[],
  callback: (action: Action) => void
) {
  return keymap.of([
    ...keyActions.map(({key, actionId}) => ({
      key,
      run: () => (callback({id: actionId, payload: {key}}), true),
    })),
    indentWithTab,
  ]);
}

function makeGraphqlExtension(schema) {
  return graphql(schema, {
    onShowInDocs: (field, type, parentType) => alert(`Showing in docs.: Field: ${field}, Type: ${type}, ParentType: ${parentType}`),
    onFillAllFields: (view, schema, _query, cursor, token) => alert(`Filling all fields. Token: ${token}`),
  });
}
