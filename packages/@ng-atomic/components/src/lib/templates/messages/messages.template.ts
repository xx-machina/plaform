import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesSectionOrganism } from '@ng-atomic/components/organisms/messages-section';
import { MessageInputSectionOrganism } from '@ng-atomic/components/organisms/message-input-section';
import { TextareaSectionOrganism } from '@ng-atomic/components/organisms/textarea-section';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Action } from '@ng-atomic/core';


@Component({
  selector: 'templates-messages',
  standalone: true,
  imports: [
    CommonModule,
    MessagesSectionOrganism,
    MessageInputSectionOrganism,
    TextareaSectionOrganism,
    ScrollFrame,
    NavigatorOrganism,
  ],
  template: `
    <frames-scroll>
      <organisms-navigator
        [startActions]="navStartActions"
        [endActions]="navEndActions"
        (action)="action.emit($event)"
        navigator
      >
        <span> メッセージ </span>
      </organisms-navigator>
      <div class="message" contents>
        <div class="scroll">
          <organisms-messages-section
            [messages]="messages"
          ></organisms-messages-section>
        </div>
        <organisms-textarea-section
          [control]="form.get(['message'])"
          (action)="action.emit($event)"
        ></organisms-textarea-section>
      </div>
    </frames-scroll>
  `,
  styleUrls: ['./messages.template.scss'],
  host: { class: 'template' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesTemplate {
  @Input()
  navStartActions: Action[] = [];

  @Input()
  navEndActions: Action[] = [];

  @Input()
  messages: {role: string, content: string}[] = [];

  @Input()
  form = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    message: new FormControl(''),
  });

  @Output()
  action = new EventEmitter<Action>();

}
