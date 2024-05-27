import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { Action, TokenizedType } from '@ng-atomic/core';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@TokenizedType()
@Directive({ standalone: true, selector: 'templates-icon-button-menu' })
export class IconButtonMenuTemplateStore extends InjectableComponent {
  readonly actions = input<Action[]>([]);
}

@Component({
  selector: 'templates-icon-button-menu',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    @for (action of store.actions(); track action.id) {
      <button mat-icon-button color="basic" (click)="dispatch(action)">
        <mat-icon>{{ action.icon }}</mat-icon>
      </button>
    }
  `,
  styleUrls: ['./icon-button-menu.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: IconButtonMenuTemplateStore,
      inputs: ['actions'],
    },
  ]
})
export class IconButtonMenuTemplate extends NgAtomicComponent {
  protected store = inject(IconButtonMenuTemplateStore);
}
