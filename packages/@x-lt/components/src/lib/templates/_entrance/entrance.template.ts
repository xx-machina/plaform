import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { Action } from '@ng-atomic/common/models';

enum ActionId {
  SIGN_IN = 'Sign In',
}

@Component({
  selector: 'templates-entrance',
  templateUrl: './entrance.template.html',
  styleUrls: ['./entrance.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntranceTemplate {

  actions: Action[] = [
    {
      id: ActionId.SIGN_IN,
      name: 'Twitterでログイン',
    },
  ];

  @Output()
  signInButtonClick = new EventEmitter<void>();

  onActionItemClick(action: Action) {
    switch (action.id) {
      case ActionId.SIGN_IN: {
        this.signInButtonClick.emit();
      }
    }
  }
}
