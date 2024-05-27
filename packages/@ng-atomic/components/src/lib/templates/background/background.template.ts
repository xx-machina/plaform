import { ChangeDetectionStrategy, Component, Directive, inject } from '@angular/core';
import { InjectableComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({standalone: true, selector: 'templates-background'})
export class BackgroundTemplateStore extends InjectableComponent { }

@Component({
  selector: 'templates-background',
  standalone: true,
  imports: [],
  template: ``,
  styleUrl: './background.template.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    BackgroundTemplateStore,
  ]
})
export class BackgroundTemplate {
  protected store = inject(BackgroundTemplateStore);
}
