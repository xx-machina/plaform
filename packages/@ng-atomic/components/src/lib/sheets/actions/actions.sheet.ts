import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';
import { Action, NgAtomicComponent } from '@ng-atomic/core';
import { IconAtom } from '@ng-atomic/components/atoms/icon';

@Component({
  selector: 'sheets-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    IconAtom,
  ],
  template: `
    <mat-action-list>
      <button mat-list-item *ngFor="let action of actions" (click)="onItemClick(action)">
        <atoms-icon matListItemIcon [name]="action.icon" [color]="action.color"></atoms-icon>
        <div matListItemTitle [style.color]="action.color">{{ action.name }}</div>
      </button>
    </mat-action-list>
  `,
  styleUrls: ['./actions.sheet.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsSheet extends NgAtomicComponent {
  protected actions = inject<Action[]>(MAT_BOTTOM_SHEET_DATA);
  private sheetRef = inject(MatBottomSheetRef<ActionsSheet>);

  protected onItemClick(action: Action): void {
    this.dispatch(action, 'root');
    this.sheetRef.dismiss(action);
  }
}
