import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Action } from '@ng-atomic/common/models';
import { FabService } from './fab.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';

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
    <ng-container *ngFor="let action of fab.actions">
      <button mat-fab color="primary" (click)="dispatch(action)">
        <mat-icon>{{ action?.icon ?? 'add' }}</mat-icon>
      </button>
    </ng-container>
  `,
  styleUrls: ['./fab.frame.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class FabFrame extends NgAtomicComponent {
  protected fab = inject(FabService);

  @Input()
  actions: Action[] = [];

}
