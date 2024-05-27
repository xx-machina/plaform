import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'frames-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
  ],
  template: `<mat-card><ng-content></ng-content></mat-card>`,
  styleUrls: ['./card.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFrame { }
