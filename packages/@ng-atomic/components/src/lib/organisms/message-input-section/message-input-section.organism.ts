import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Action } from '@ng-atomic/core';

export enum ActionId {
  SEND = 'send',
}

@Component({
  selector: 'organisms-message-input-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './message-input-section.organism.html',
  styleUrls: ['./message-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputSectionOrganism {

  @Input()
  control = new FormControl('');

  @Output()
  action = new EventEmitter<Action<string>>();

  protected onSendButtonClick() {
    this.action.emit({id: ActionId.SEND});
  }

}
