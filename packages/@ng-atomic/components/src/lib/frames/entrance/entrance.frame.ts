import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayFrame } from '@ng-atomic/components/frames/overlay';
import { EntranceTemplateStore } from '@ng-atomic/components/templates/entrance';
import { Action, InjectableComponent, NgAtomicComponent } from '@ng-atomic/core';
import { FormControl, FormGroup } from '@angular/forms';

@Directive({standalone: true})
export class EntranceFrameStore extends InjectableComponent {
  readonly isEntrance = input(true);
  readonly actions = input<Action[]>([]);
  readonly form = input(new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  }));
  readonly title = input('ログイン');
}

@Component({
  selector: 'frames-entrance',
  standalone: true,
  imports: [
    CommonModule,
    OverlayFrame,
    EntranceTemplateStore,
  ],
  template: `
    <frames-overlay [hasNext]="store.isEntrance()" ngSkipHydration>
      <ng-content main/>
      <templates-entrance next injectable
        [actions]="store.actions()"
        [form]="store.form()"
        [title]="store.title()"
        (action)="dispatch($event)"
      />
    </frames-overlay>
  `,
  styleUrls: ['./entrance.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: EntranceFrameStore,
      inputs: ['isEntrance', 'actions', 'form', 'title'],
    },
  ],
})
export class EntranceFrame extends NgAtomicComponent {
  protected store = inject(EntranceFrameStore);
}
