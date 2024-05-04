import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';

enum ActionId {
  DRAG_STARTED = '[@ng-atomic/divider] drag start',
  DRAG_MOVED = '[@ng-atomic/divider] drag move',
  DRAG_ENDED = '[@ng-atomic/divider] drag end',
}

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
      (cdkDragEnded)="onDragEnd($event)"
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
export class DividerFrame extends NgAtomicComponent {
  static ActionId = ActionId;

  private el = inject(ElementRef);

  protected firstContentHeight: number;
  protected distance: {x: number, y: number} = {x: 0, y: 0};


  @ViewChild('el', {read: ElementRef})
  divider: ElementRef<HTMLElement>;

  protected onDragStart($event: CdkDragStart) {
    this.dispatch({id: ActionId.DRAG_STARTED, payload: $event}, 'default');
    const parentRect = this.divider.nativeElement.parentElement.getBoundingClientRect();
    const elementRect = this.divider.nativeElement.getBoundingClientRect();
    this.firstContentHeight = elementRect.top - parentRect.top;
  }

  protected onDragMoved($event: CdkDragMove) {
    this.dispatch({id: ActionId.DRAG_MOVED, payload: $event}, 'default');
    this.divider.nativeElement.style.transform = `translate3d(0, 0, 0)`;
    const height = Math.max(1, this.firstContentHeight + $event.distance.y);
    this.el.nativeElement.style.setProperty('--first-content-height', `${height}px`);
  }

  protected onDragEnd($event: CdkDragMove) {
    this.dispatch({id: ActionId.DRAG_ENDED, payload: $event}, 'default');
  }
}
