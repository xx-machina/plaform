import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgAtomicComponent } from '@ng-atomic/core';

@Directive({ standalone: true, selector: 'frames-loading' })
export class LoadingFrameStore {
  readonly isLoading = input(false);
}

@Component({
  selector: 'frames-loading',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="contents"><ng-content /></div>
    @if(store.isLoading()) {
      <div class="loading"><mat-spinner /></div>
    }
  `,
  styleUrls: ['./loading.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: LoadingFrameStore,
      inputs: ['isLoading'],
    }
  ]
})
export class LoadingFrame extends NgAtomicComponent {
  protected store = inject(LoadingFrameStore);

}
