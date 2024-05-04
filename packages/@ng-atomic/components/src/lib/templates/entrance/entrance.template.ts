import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Action } from '@ng-atomic/common/models';
import { FormGroup, FormControl} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { CardFrame } from '@ng-atomic/components/frames/card';
import { ActionButtonsSectionOrganism } from '@ng-atomic/components/organisms/action-buttons-section';
import { HeadingOrganism } from '@ng-atomic/components/organisms/heading';
import { SocialLoginSectionOrganism } from '@ng-atomic/components/organisms/social-login-section';
import { TextInputSectionOrganism } from '@ng-atomic/components/organisms/text-input-section';

enum ActionId {
  SIGN_IN = '[@ng-atomic/components] Sign In',
  SIGN_IN_WITH_GOOGLE = '[@ng-atomic/components] Sign In With Google',
  SIGN_IN_WITH_TWITTER = '[@ng-atomic/components] Sign In With Twitter',
}

export const Actions: Action[] = [
  {
    id: ActionId.SIGN_IN,
    name: 'Sign In',
    icon: 'login',
  },
  {
    id: ActionId.SIGN_IN_WITH_GOOGLE,
    name: 'Sign In With Google',
    icon: 'google',
  },
  {
    id: ActionId.SIGN_IN_WITH_TWITTER,
    name: 'Sign In With Twitter',
    icon: 'twitter',
  },
];

@Component({
  selector: 'templates-entrance',
  standalone: true,
  imports: [
    CommonModule,
    AutoLayoutFrame,
    CardFrame,
    ActionButtonsSectionOrganism,
    HeadingOrganism,
    SocialLoginSectionOrganism,
    TextInputSectionOrganism,
  ],
  template: `
  <frames-card>
    <frames-auto-layout vertical>
      <organisms-heading>ログイン</organisms-heading>
      <organisms-text-input-section
        *ngIf="form.get('email')"
        label="メールアドレス"
        [control]="form.get('email')"
      ></organisms-text-input-section>
      <organisms-text-input-section
        *ngIf="form.get('password')"
        label="パスワード"
        [control]="form.get('password')"
      ></organisms-text-input-section>
      <organisms-action-buttons-section
        [actions]="actions"
        (action)="action.emit($event)"
      ></organisms-action-buttons-section>
    </frames-auto-layout>
  </frames-card>
  `,
  styleUrls: ['./entrance.template.scss'],
  host: {class: 'template'},
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntranceTemplate {
  static ActionId = ActionId;
  protected ActionId = ActionId

  @Input()
  form = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  @Input()
  actions = Actions;

  @Output()
  action = new EventEmitter<Action>()
}
