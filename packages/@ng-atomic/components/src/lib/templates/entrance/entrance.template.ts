import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';
import { FormGroup, FormControl} from '@angular/forms';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { CardFrame } from '@ng-atomic/components/frames/card';
import { ActionButtonsSectionOrganism } from '@ng-atomic/components/organisms/action-buttons-section';
import { HeadingOrganism } from '@ng-atomic/components/organisms/heading';
import { SocialLoginSectionOrganism } from '@ng-atomic/components/organisms/social-login-section';
import { TextInputSectionOrganismStore } from '@ng-atomic/components/organisms/text-input-section';

enum ActionId {
  SIGN_IN = '[@ng-atomic/components] Sign In',
  SIGN_IN_WITH_GOOGLE = '[@ng-atomic/components] Sign In With Google',
  SIGN_IN_WITH_TWITTER = '[@ng-atomic/components] Sign In With Twitter',
}

@TokenizedType()
@Directive({
  selector: 'templates-entrance',
  standalone: true,
})
export class EntranceTemplateStore extends InjectableComponent {
  readonly form = input(new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  }));
  readonly actions = input([
    { id: ActionId.SIGN_IN, name: 'Sign In', icon: 'login' },
    { id: ActionId.SIGN_IN_WITH_GOOGLE, name: 'Sign In With Google', icon: 'google' },
    { id: ActionId.SIGN_IN_WITH_TWITTER, name: 'Sign In With Twitter', icon: 'twitter' },
  ]);

  readonly title = input('ログイン');
}

@Component({
  selector: 'templates-entrance',
  standalone: true,
  imports: [
    AutoLayoutFrame,
    CardFrame,
    ActionButtonsSectionOrganism,
    HeadingOrganism,
    SocialLoginSectionOrganism,
    TextInputSectionOrganismStore,
  ],
  template: `
  <frames-card>
    <frames-auto-layout vertical>
      <organisms-heading>{{ store.title() }}</organisms-heading>
      @if (store.form()) {
        @if (store.form().get('email')) {
          @defer {
            <organisms-text-input-section injectable
              label="メールアドレス"
              [control]="store.form().get('email')"
            />
          }
        }
        @if (store.form().get('password')) {
          @defer {
            <organisms-text-input-section injectable
              label="パスワード"
              [control]="store.form().get('password')"
            />
          }
        }
        @for (action of store.actions(); track action.id;) {
          @defer {
            <organisms-action-buttons-section
              [actions]="[action]"
              (action)="dispatch($event)"
            />
          } @error { error } }
      }
    </frames-auto-layout>
  </frames-card>
  `,
  styleUrls: ['./entrance.template.scss'],
  host: {class: 'template'},
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: EntranceTemplateStore,
      inputs: ['form', 'actions', 'title'],
    },
  ],
})
export class EntranceTemplate extends NgAtomicComponent {
  static ActionId = ActionId;
  protected ActionId = ActionId;
  protected store = inject(EntranceTemplateStore);
}
