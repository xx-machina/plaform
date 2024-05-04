import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '@ng-atomic/components/extras/editor';
import { EventEmitter, Input, Output } from '@angular/core';
import { keymap, KeyBinding } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import { EditorState } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { basicSetup, EditorView } from "codemirror"
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';
import { ReplaySubject, distinctUntilChanged, map, switchMap } from 'rxjs';
import { html } from "@codemirror/lang-html";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";

enum ActionId {
  UPDATE_FILE = '[@matcher/assistant/templates/code-editor] update file',
}

@Component({
  selector: 'templates-code-editor',
  standalone: true,
  imports: [
    CommonModule,
    EditorComponent,
  ],
  template: `
    <extras-editor
      [state]="state$ | async"
    ></extras-editor>
  `,
  styleUrls: ['./code-editor.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CodeEditorTemplate extends NgAtomicComponent {
  static ActionId = ActionId;

  state = this.makeEditorState({value: 'test'});

  file$ = new ReplaySubject<File>(1);
  state$ = this.file$.pipe(
    switchMap(file => file.text()),
    distinctUntilChanged(),
    map((text) => this.makeEditorState({value: text})),
  );

  @Input()
  set file(value: File | null) {
    this.file$.next(value);
  }
  get file(): File | null {
    return this._file;
  }
  private _file: File | null = null;

  @Input()
  keyActions: {key: string, actionId: string}[] = [];

  private makeEditorState({value}: {value: string}) {
    // const formattedHtml = prettier.format(value, {
    //   parser: "html",
    //   plugins: [parserHtml]
    // });
    return EditorState.create({
      doc: value,
      extensions: [
        keymap.of([
          ...(this.keyActions ?? []).map(({key, actionId}) => ({
            key,
            run: () => (this.dispatch({id: actionId}), true),
          })),
          indentWithTab,
        ]),
        basicSetup,
        html(),
        EditorView.updateListener.of((update) => {
          const content = update.state.doc.toString();
          this.dispatch({
            id: ActionId.UPDATE_FILE,
            payload: new File([content], this.file?.name ?? 'index.html', {
              type: 'text/plain',
            }),
          });
        }),
        bracketMatching(),
        closeBrackets(),
        history(),
        autocompletion(),
        lineNumbers(),
        oneDark,
        syntaxHighlighting(oneDarkHighlightStyle),
      ],
    });
  }
}
