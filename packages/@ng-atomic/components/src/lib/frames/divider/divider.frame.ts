import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'frames-divider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './divider.frame.html',
  styleUrls: ['./divider.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DividerFrame {

}
