import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

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
  <div class="contents" #contents>
    <ng-content></ng-content>
    <!-- <ng-content select=[contents]></ng-content> -->
  </div>
  <div class="bottom">
    <ng-content select=[bottom]></ng-content>
  </div>
  `,
  styleUrls: ['./scroll.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollFrame {

  @ViewChild('contents', {static: true})
  protected contents: ElementRef<HTMLDivElement>;

  isScrollBottom() {
    const contents = this.contents.nativeElement;
    return contents.scrollHeight - contents.scrollTop === contents.clientHeight;
  }

  scrollToBottom() {
    this.contents.nativeElement.scrollTop = this.contents.nativeElement.scrollHeight;
  }
}
