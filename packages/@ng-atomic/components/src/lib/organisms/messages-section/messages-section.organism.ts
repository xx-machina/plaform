import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'organisms-messages-section',
  template: `
  <ng-container *ngFor="let message of messages; trackBy: trackById">
    <ng-container [ngSwitch]="message.role">
      <div class="user message" *ngSwitchCase="'user'">
        <div class="balloon">
          <span> {{ message.content }}</span>
        </div>
      </div>
      <div class="opponent message" *ngSwitchDefault>
        <div class="opponent"></div>
        <div class="balloon">
          <span> {{ message.content }}</span>
        </div>
      </div>      
    </ng-container>
  </ng-container>
  <div class="opponent message" *ngIf="isMessageCreating">
    <div class="opponent"></div>
    <div class="balloon">
      <span> {{ isMessageCreating }}</span>
      <div class="pulse-container"><div class="dot-pulse"></div></div>
    </div>
  </div>
  `,
  styleUrls: ['./messages-section.organism.scss'],
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesSectionOrganism {
  trackById = (index: number, item: any) => item.id;

  @Input() messages: {role: string, content: string}[] = [];
  @Input() isMessageCreating: false | string = false;
  
}
