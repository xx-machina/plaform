import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'organisms-heading',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './heading.organism.html',
  styleUrls: ['./heading.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingOrganism {
  @Input()
  level: 1 | 2 | 3 | 4 | 5 | 6 = 1;
}
