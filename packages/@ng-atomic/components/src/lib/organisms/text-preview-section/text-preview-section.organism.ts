import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, contentChild, inject, input } from '@angular/core';
import { InjectableComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({
  standalone: true,
  selector: 'organisms-text-preview-section',
  host: { class: 'section organism' },
})
export class TextPreviewSectionOrganismStore extends InjectableComponent {
  readonly label = input('label');
  readonly value = input('value');
}

@Component({
  selector: 'organisms-text-preview-section',
  standalone: true,
  imports: [
    NgTemplateOutlet,
  ],
  template: `
  <div class="item">
    <div class="title">
      @if (labelTemp()) {
        <ng-content selector=[labelTemp]/>
      } @else {
        <span>{{ store.label() }}</span>
      }
    </div>
    <div class="description">
      @if (valueTemp()) {
        <ng-content selector=[valueTemp]/>
      } @else {
        <span>{{ store.value() }}</span>
      }
    </div>
  </div>`,
  styleUrl: './text-preview-section.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: TextPreviewSectionOrganismStore,
      inputs: ['label', 'value'],
    }
  ],
})
export class TextPreviewSectionOrganism {
  protected readonly store = inject(TextPreviewSectionOrganismStore);
  readonly labelTemp = contentChild('labelTemp');
  readonly valueTemp = contentChild('valueTemp');
}
