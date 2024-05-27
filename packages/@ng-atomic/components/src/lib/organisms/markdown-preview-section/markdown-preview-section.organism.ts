import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { MarkdownComponent, MarkdownModule } from 'ngx-markdown';

@Directive({standalone: true, selector: 'markdown-preview-section'})
export class MarkdownPreviewSectionStore {
  readonly content = input(`# test

  ## あいうえお`);
}

@Component({
  selector: 'organisms-markdown-preview-section',
  standalone: true,
  imports: [
    MarkdownComponent,
  ],
  template: `
  <markdown>{{ store.content() }}</markdown>
  `,
  styleUrl: './markdown-preview-section.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MarkdownPreviewSectionStore,
      inputs: ['content'],
    }
  ]
})
export class MarkdownPreviewSectionOrganism {
  protected store = inject(MarkdownPreviewSectionStore);
}
