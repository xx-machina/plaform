import { ChangeDetectionStrategy, Component, Directive, InjectionToken, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

export const VERSION = new InjectionToken<string>('VERSION');

export function provideVersion(useFactory: () => string) {
  return { provide: VERSION, useFactory };
}

@TokenizedType()
@Directive({standalone: true, selector: 'organisms-menu-footer'})
export class MenuFooterOrganismStore extends InjectableComponent {
  readonly version = inject(VERSION, {optional: true}) ?? 'v0.0.0';
}

@Component({
  selector: 'organisms-menu-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span>{{ store.version }}</span>
  `,
  styleUrls: ['./menu-footer.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MenuFooterOrganismStore,
    },
  ],
})
export class MenuFooterOrganism extends NgAtomicComponent {
  protected store = inject(MenuFooterOrganismStore);
}
