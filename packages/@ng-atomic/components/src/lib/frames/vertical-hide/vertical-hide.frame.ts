import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalDividerOrganism } from '@ng-atomic/components/organisms/vertical-divider';

@Component({
  selector: 'frames-vertical-hide',
  standalone: true,
  imports: [
    CommonModule,
    VerticalDividerOrganism,
  ],
  template: `
    <ng-content></ng-content>
    <organisms-vertical-divider></organisms-vertical-divider>
  `,
  styleUrls: ['./vertical-hide.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalHideFrame {

  @Input()
  @HostBinding('attr.mode')
  mode: 'collapsed' | 'expanded' = 'collapsed';

}
