import { ChangeDetectionStrategy, Component, ElementRef, Signal, inject, viewChild } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { CdkDrag, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { NgAtomicComponent } from '@ng-atomic/core';

enum ActionId {
  DRAG_STARTED = '[@ng-atomic/divider] drag start',
  DRAG_MOVED = '[@ng-atomic/divider] drag move',
  DRAG_ENDED = '[@ng-atomic/divider] drag end',
}

@Component({
  selector: 'frames-divider',
  standalone: true,
  imports: [
    MatDividerModule,
    CdkDrag,
  ],
  template: `
    <div class="first" #first>
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

  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected firstContentHeight: number;
  readonly firstContent: Signal<ElementRef<HTMLDivElement>> = viewChild('first', {read: ElementRef});
  readonly divider: Signal<ElementRef<HTMLDivElement>> = viewChild.required('el', {read: ElementRef});

  protected onDragStart($event: CdkDragStart) {
    this.dispatch({id: ActionId.DRAG_STARTED, payload: $event}, 'default');
    const parentRect = this.divider().nativeElement.parentElement.getBoundingClientRect();
    const elementRect = this.divider().nativeElement.getBoundingClientRect();
    this.firstContentHeight = elementRect.top - parentRect.top;
  }

  protected onDragMoved($event: CdkDragMove) {
    this.dispatch({id: ActionId.DRAG_MOVED, payload: $event}, 'default');
    this.divider().nativeElement.style.transform = `translate3d(0, 0, 0)`;
    const height = Math.max(1, this.firstContentHeight + $event.distance.y);
    this.setFirstContentHeight(height, 'px');
  }

  protected onDragEnd($event: CdkDragMove) {
    this.dispatch({id: ActionId.DRAG_ENDED, payload: $event}, 'default');
  }

  setFirstContentHeight(height: number, unit: 'px' | '%' = 'px', {
    animate = false
  }: {animate?: boolean} = {}) {
    if (this.firstContent() && animate) {
      this.firstContent().nativeElement.style.transition = 'height 0.5s';
      setTimeout(() => this.firstContent().nativeElement.style.transition = 'none', 500);
    }
    this.el.nativeElement.style.setProperty('--first-content-height', `${height}${unit}`);
  }
}
