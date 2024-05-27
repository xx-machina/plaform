import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'organisms-heading',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <ng-template #temp><ng-content></ng-content></ng-template>
  @switch(level) {
    @case(1) {
      <h1><ng-container *ngTemplateOutlet="temp;"></ng-container></h1>
    }
    @case(2) {
      <h2><ng-container *ngTemplateOutlet="temp;"></ng-container></h2>
    }
    @case(3) {
      <h3><ng-container *ngTemplateOutlet="temp;"></ng-container></h3>
    }
    @case(4) {
      <h4><ng-container *ngTemplateOutlet="temp;"></ng-container></h4>
    }
    @case(5) {
      <h5><ng-container *ngTemplateOutlet="temp;"></ng-container></h5>
    }
    @case(6) {
      <h6><ng-container *ngTemplateOutlet="temp;"></ng-container></h6>
    }
  }
  `,
  styleUrls: ['./heading.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingOrganism {
  @Input()
  level: 1 | 2 | 3 | 4 | 5 | 6 = 1;
}
