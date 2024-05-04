import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { OVERLAY_ANIMATION } from './overlay.animations';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'frames-overlay',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="main content"><ng-content select=[main]></ng-content></div>
    <div class="next content" *ngIf="hasNext" @hasNext><ng-content select=[next]></ng-content></div>
  `,
  styleUrls: ['./overlay.frame.scss'],
  animations: [OVERLAY_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayFrame {
  @Input() hasNext = false;
}
