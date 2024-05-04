import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'frames-divider',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
    CdkDrag,
  ],
  template: `
    <div class="first">
      <ng-content select="[first]"></ng-content>
    </div>
    <mat-divider
      cdkDrag
      cdkDragHandle
      [cdkDragStartDelay]="0"
      (cdkDragStarted)="onDragStart($event)"
      (cdkDragMoved)="onDragMoved($event)"
      cdkDragLockAxis="y"
      #el
    ></mat-divider>
    <div class="second">
      <ng-content select="[second]"></ng-content>
    </div>
  `,
  styleUrls: ['./divider.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerFrame {

  constructor(
    private el: ElementRef,
  ) { }

  protected firstContentHeight: number;
  protected distance: {x: number, y: number} = {x: 0, y: 0};


  @ViewChild('el', {read: ElementRef})
  divider: ElementRef<HTMLElement>;

  onDragStart($event: CdkDragStart) {
    const parentRect = this.divider.nativeElement.parentElement.getBoundingClientRect();
    const elementRect = this.divider.nativeElement.getBoundingClientRect();
    this.firstContentHeight = elementRect.top - parentRect.top;
  }

  onDragMoved($event: CdkDragMove) {
    this.divider.nativeElement.style.transform = `translate3d(0, 0, 0)`;
    const height = Math.max(1, this.firstContentHeight + $event.distance.y);
    this.el.nativeElement.style.setProperty('--first-content-height', `${height}px`);
  }
}
