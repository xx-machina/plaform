import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IosSafariScrollBuggyfillModule } from '@ng-atomic/common/directives/ios-safari-scroll-buggyfill';

@Component({
  selector: 'frames-scroll',
  standalone: true,
  imports: [
    CommonModule,
    IosSafariScrollBuggyfillModule,
  ],
  templateUrl: './scroll.frame.html',
  styleUrls: ['./scroll.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollFrame { }
