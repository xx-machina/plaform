import { ChangeDetectionStrategy, Component, Directive, Input, inject, input } from '@angular/core';
import { OVERLAY_ANIMATION } from './overlay.animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Directive({ standalone: true, selector: 'frames-overlay' })
export class OverlayFrameStore {
  readonly hasNext = input(false);
}

@Component({
  selector: 'frames-overlay',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="main content"><ng-content select=[main] /></div>
    @if (store.hasNext()) { 
      <div class="next content" @hasNext><ng-content select=[next] /></div>
    }
  `,
  styleUrls: ['./overlay.frame.scss'],
  animations: [OVERLAY_ANIMATION],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: OverlayFrameStore,
      inputs: ['hasNext'],
    },
  ],
})
export class OverlayFrame {
  protected readonly store = inject(OverlayFrameStore);
}
