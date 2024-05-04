import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'frames-smart-menu',
  templateUrl: './smart-menu.frame.html',
  styleUrls: ['./smart-menu.frame.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SmartMenuFrame {
  @Input()
  protected mode: 'expanded' | 'collapsed' = 'expanded';
}
