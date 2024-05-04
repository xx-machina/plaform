import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'frames-scroll',
  standalone: true,
  imports: [
    CommonModule,
  ],
  template: `
  <div class="top">
    <ng-content select=[top]></ng-content>
  </div>
  <div class="contents">
    <ng-content select=[contents]></ng-content>
  </div>
  <div class="bottom">
    <ng-content select=[bottom]></ng-content>
  </div>
  `,
  styleUrls: ['./scroll.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollFrame { }
