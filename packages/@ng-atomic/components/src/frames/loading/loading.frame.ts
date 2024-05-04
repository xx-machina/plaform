import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'frames-loading',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="contents"><ng-content></ng-content></div>
    <div class="loading" *ngIf="isLoading"><mat-spinner></mat-spinner></div>
  `,
  styleUrls: ['./loading.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingFrame {

  @Input()
  isLoading = false;

}
