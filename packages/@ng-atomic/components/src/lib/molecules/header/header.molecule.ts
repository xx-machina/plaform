import { Component, ChangeDetectionStrategy, Directive, input, inject } from '@angular/core';
import { InjectableComponent, NgAtomicComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'molecules-header' })
export class HeaderMoleculeStore extends InjectableComponent {
  readonly title = input('title');
  readonly description = input('');
}

@Component({
  selector: 'molecules-header',
  standalone: true,
  template: `
    <span class="title">{{ store.title() ?? '' }}</span>
    <span class="description">{{ store.description() ?? '' }}</span>
  `,
  styleUrls: ['./header.molecule.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: HeaderMoleculeStore,
      inputs: ['title', 'description']
    }
  ]
})
export class HeaderMolecule extends NgAtomicComponent {
  protected store = inject(HeaderMoleculeStore);
}
