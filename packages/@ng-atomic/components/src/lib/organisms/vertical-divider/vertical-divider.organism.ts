import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'organisms-vertical-divider',
  standalone: true,
  imports: [
    CommonModule,
    MatDividerModule,
  ],
  template: `<mat-divider></mat-divider>`,
  styleUrls: ['./vertical-divider.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerticalDividerOrganism { }
