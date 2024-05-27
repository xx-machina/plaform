import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgAtomicComponent } from '@ng-atomic/core';

@Component({
  selector: 'organisms-image-preview-section',
  standalone: true,
  imports: [],
  template: `<img [src]="src()" />`,
  styleUrl: './image-preview-section.organism.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImagePreviewSectionOrganism extends NgAtomicComponent {
  readonly src = input<string>();
}
