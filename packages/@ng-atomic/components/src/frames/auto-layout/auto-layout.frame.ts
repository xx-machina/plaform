import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'frames-auto-layout',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './auto-layout.frame.html',
  styleUrls: ['./auto-layout.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoLayoutFrame { }
