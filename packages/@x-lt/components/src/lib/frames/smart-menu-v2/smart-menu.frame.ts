import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DrawerFrame } from '@ng-atomic/components/frames/drawer';

@Component({
  selector: 'frames-smart-menu',
  standalone: true,
  imports: [
    CommonModule,
    DrawerFrame,
  ],
  templateUrl: './smart-menu.frame.html',
  styleUrls: ['./smart-menu.frame.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartMenuFrame {
  @Input()
  protected mode: 'expanded' | 'collapsed' = 'expanded';
}
