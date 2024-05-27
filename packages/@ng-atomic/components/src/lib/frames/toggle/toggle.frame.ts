import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { SelectionModel } from '@angular/cdk/collections';
import { Action, NgAtomicComponent } from '@ng-atomic/core';

@Component({
  selector: 'frames-toggle',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonToggleModule,
    MatIconModule,
  ],
  template: `
    <ng-content />
    <mat-button-toggle-group #group="matButtonToggleGroup" (change)="onChange($event)">
      @for (action of actions; track action.id) {
        <mat-button-toggle [value]="action">
          <mat-icon>{{ action.icon }}</mat-icon>
        </mat-button-toggle>
      }
    </mat-button-toggle-group>
  `,
  styleUrls: ['./toggle.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleFrame extends NgAtomicComponent {
  @Input() actions: Action[] = [];

  protected onChange($event: MatButtonToggleChange) {
    this.dispatch($event.value);
  }
}
