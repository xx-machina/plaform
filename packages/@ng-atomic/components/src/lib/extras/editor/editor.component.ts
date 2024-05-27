import { ChangeDetectionStrategy, Component, computed, model, Directive, inject, input, effect, ElementRef, viewChild, Output, EventEmitter, Inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { keymap } from "@codemirror/view"
import { indentWithTab } from "@codemirror/commands"
import { history } from '@codemirror/commands';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { bracketMatching, syntaxHighlighting } from '@codemirror/language';
import { oneDarkHighlightStyle, oneDark } from '@codemirror/theme-one-dark';
import { EditorSelection, EditorState, Extension } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { basicSetup, EditorView } from "codemirror"
import { html } from "@codemirror/lang-html";
import prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import { NgAtomicComponent } from '@ng-atomic/core';
import { graphql } from 'cm6-graphql';
import { distinctUntilChanged } from 'rxjs';
import { json } from "@codemirror/lang-json";

@Component({
  selector: 'extras-editor',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: ``,
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent extends NgAtomicComponent {
  readonly content = input<string>('');
  readonly _contentChange$ = new EventEmitter<string>();
  @Output() readonly contentChange = new EventEmitter<string>();
  readonly keyActions = input<{key: string, actionId: string}[]>();
  readonly extensions = input<Extension[]>([
    json(),
  ]);
  readonly el = inject(ElementRef);

  // readonly state = computed(() => {
  //   return EditorState.create({
  //     doc: this.content() ?? '',
  //     extensions: [
  //       keymap.of([
  //         ...(this.keyActions() ?? []).map(({key, actionId}) => ({
  //           key,
  //           run: () => (this.dispatch({id: actionId}), true),
  //         })),
  //         indentWithTab,
  //       ]),
  //       html(),
  //       ...this.extensions(),
  //       graphql(),
  //     ],
  //   });
  // });

  editorView!: EditorView;

  readonly cd = inject(ChangeDetectorRef);

  constructor() {
    super();
    effect(() => {
      const selection = this.editorView.state.selection;
      this.editorView.dispatch(
        this.editorView.state.update({
          changes: {
            from: 0,
            to: this.editorView.state.doc.length,
            insert: this.content() ?? '',
          },
          selection: selection,
          scrollIntoView: true,
        }),
      );
    });
  }

  ngOnInit(): void {
    this._contentChange$.pipe(
      distinctUntilChanged(),
    ).subscribe((content) => {
      this.contentChange.emit(content);
    });
  }

  ngAfterViewInit() {
    this.editorView?.destroy();
    this.editorView = new EditorView({
      state: EditorState.create({
        doc: ``,
        extensions: [
          basicSetup,
          bracketMatching(),
          closeBrackets(),
          history(),
          autocompletion(),
          lineNumbers(),
          oneDark,
          syntaxHighlighting(oneDarkHighlightStyle),
          EditorView.updateListener.of((update) => {
            if (!update.docChanged) return;
            this._contentChange$.emit(update.state.doc.toString());
          }),
          ...this.extensions(),
        ],
      }),
      parent: this.el.nativeElement,
    })
  }
}
