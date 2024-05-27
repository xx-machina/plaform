import { ChangeDetectionStrategy, Component, Directive, inject, input, model, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '@ng-atomic/components/extras/editor';
import { NgAtomicComponent } from '@ng-atomic/core';
import { Extension } from '@codemirror/state';


enum ActionId {
  UPDATE_FILE = '[@matcher/assistant/templates/code-editor] update file',
}

@Directive({
  standalone: true,
  selector: 'templates-code-editor',
})
export class CodeEditorTemplateStore {
  content = model<string>('');
  readonly extensions = input<Extension[]>([]);
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
      [(content)]="store.content"
      [extensions]="store.extensions()"
    />
  `,
  styleUrls: ['./code-editor.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: CodeEditorTemplateStore,
      inputs: ['content', 'extensions'],
      outputs: ['contentChange'],
    }
  ]
})
export class CodeEditorTemplate extends NgAtomicComponent {
  static ActionId = ActionId;
  protected store = inject(CodeEditorTemplateStore);
  readonly editor = viewChild(EditorComponent);
}
