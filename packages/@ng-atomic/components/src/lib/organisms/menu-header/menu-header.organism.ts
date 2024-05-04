import { ChangeDetectionStrategy, Component, Directive, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/common/core';

@Directive({ standalone: true, selector: 'organisms-menu-header' })
export class MenuHeaderOrganismStore extends InjectableComponent {
  static readonly TOKEN = new InjectionToken('[@ng-atomic/components] MenuHeaderOrganismStore');
}

@Component({
  selector: 'organisms-menu-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p>
      menu-header works!
    </p>
  `,
  styleUrls: ['./menu-header.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [MenuHeaderOrganismStore],
})
export class MenuHeaderOrganism extends NgAtomicComponent {

}
