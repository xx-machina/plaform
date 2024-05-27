import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesSectionOrganism } from '@ng-atomic/components/organisms/messages-section';
import { MessageInputSectionOrganism } from '@ng-atomic/components/organisms/message-input-section';
import { TextareaSectionOrganism } from '@ng-atomic/components/organisms/textarea-section';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll-v2';
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
        top
      >
        <span> {{ title }} </span>
      </organisms-navigator>
      <organisms-messages-section
        [isMessageCreating]="isMessageCreating"
        [messages]="messages"
        contents
      />
      <organisms-textarea-section
        [actions]="actions"
        [control]="form.get(['message'])"
        [rows]="3"
        [floatLabel]="'always'"
        [label]="'入力'"
        [placeholder]="placeholder"
        (action)="action.emit($event)"
        bottom
      />
    </frames-scroll>
  `,
  styleUrls: ['./messages.template.scss'],
  host: { class: 'template' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesTemplate {
  @Input() title = 'title';
  @Input() navStartActions: Action[] = [];
  @Input() navEndActions: Action[] = [];
  @Input() messages: {role: string, content: string}[] = [];
  @Input() actions: Action[] = [];
  @Input() placeholder = 'メッセージを入力';
  @Input() isMessageCreating: false | string = false;

  @Input()
  form = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    message: new FormControl(''),
  });

  @Output() action = new EventEmitter<Action>();

  @ViewChild(ScrollFrame, {static: true})
  scrollFrame: ScrollFrame;

  ngAfterViewInit() {
    this.scrollFrame.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.messages && this.scrollFrame.isScrollBottom()) {
      setTimeout(() => this.scrollFrame.scrollToBottom());
    }
  }

}
