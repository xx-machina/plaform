import { ChangeDetectionStrategy, Component, Directive, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/core';

@Directive({standalone: true, selector: 'organisms-menu-footer'})
export class MenuFooterOrganismStore extends InjectableComponent {
  static TOKEN = new InjectionToken<MenuFooterOrganismStore>('[@ng-atomic/components] MenuFooterOrganismStore');
}

@Component({
  selector: 'organisms-menu-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      menu-footer works!
    </p>
  `,
  styleUrls: ['./menu-footer.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: MenuFooterOrganismStore,
    },
  ],
})
export class MenuFooterOrganism extends NgAtomicComponent { }
