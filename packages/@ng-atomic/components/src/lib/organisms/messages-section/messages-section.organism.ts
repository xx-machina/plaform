import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'organisms-messages-section',
  templateUrl: './messages-section.organism.html',
  styleUrls: ['./messages-section.organism.scss'],
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesSectionOrganism {

  @Input()
  messages: {role: string, content: string}[] = [];
  
}
