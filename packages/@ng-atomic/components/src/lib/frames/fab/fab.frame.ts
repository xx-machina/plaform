import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Action } from '@ng-atomic/common/models';
import { FabService } from './fab.service';
import { ReplaySubject, takeUntil } from 'rxjs';

@Component({
  selector: 'frames-fab',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <ng-content></ng-content>
    <ng-container *ngFor="let action of actions">
      <button mat-fab color="primary" (click)="service.onAction(action)">
        <mat-icon>{{ action?.icon ?? 'add' }}</mat-icon>
      </button>
    </ng-container>
  `,
  styleUrls: ['./fab.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabFrame implements OnInit, OnDestroy {

  constructor(
    protected service: FabService,
  ) { }

  private readonly destroy$ = new ReplaySubject<void>(1);

  @Input()
  actions: Action[] = [];

  @Output()
  protected action = new EventEmitter<Action>();

  ngOnInit(): void {
    this.service.action$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((action) => {
      this.action.emit(action);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

}
