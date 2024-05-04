import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { EditorState } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'extras-editor',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `<div #editor></div>`,
  styleUrls: ['./editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent {

  private readonly state$ = new ReplaySubject<EditorState>(1);

  @Input()
  set state(value: EditorState | null) {
    if (!value) return;
    this.state$.next(value);
  }

  @ViewChild('editor', { static: true })
  private _editor!: ElementRef<HTMLElement>;
  editor!: EditorView;

  async ngAfterViewInit() {
    this.state$.subscribe((state) => {
      if (this.editor) {
        const transaction = this.editor.state.update({
          ...state,
          selection: this.editor.state.selection,
        });
        this.editor.dispatch(transaction);
      } else {
        this.editor = new EditorView({
          state,
          parent: this._editor.nativeElement
        });
      }
    });
  }
}
