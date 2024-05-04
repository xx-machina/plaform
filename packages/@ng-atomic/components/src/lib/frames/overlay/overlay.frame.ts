import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
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
  templateUrl: './overlay.frame.html',
  styleUrls: ['./overlay.frame.scss'],
  animations: [OVERLAY_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayFrame {
  @Input()
  hasNext = false;
}
