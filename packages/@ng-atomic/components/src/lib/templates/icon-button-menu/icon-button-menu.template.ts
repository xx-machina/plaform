import { ChangeDetectionStrategy, Component, Directive, InjectionToken, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Action } from '@ng-atomic/common/models';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/common/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Directive({ standalone: true, selector: 'templates-icon-button-menu' })
export class IconButtonMenuTemplateStore extends InjectableComponent {
  static TOKEN = new InjectionToken('IconButtonMenuTemplateStore');
  @Input() actions: Action[] = [];
}

@Component({
  selector: 'templates-icon-button-menu',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <button
      mat-icon-button
      color="basic"
      *ngFor="let action of store.actions"
      (click)="dispatch(action)"
    >
      <mat-icon>{{ action.icon }}</mat-icon>
    </button>
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
