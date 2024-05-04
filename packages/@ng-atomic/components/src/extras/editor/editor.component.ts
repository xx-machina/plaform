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
  templateUrl: './editor.component.html',
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
  private editor!: EditorView;

  async ngOnInit(): Promise<void> { }

  async ngAfterViewInit() {
    this.state$.subscribe((state) => {
      if (this.editor) {
        this.editor.dispatch(
          this.editor.state.update({...state}),
          {changes: { from: 0, to: this.editor.state.doc.length, insert: state.doc.toString() }},
        );
      } else {
        this.editor = new EditorView({state, parent: this._editor.nativeElement});
      }
    });
  }
}
