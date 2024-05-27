import { ChangeDetectionStrategy, Component, Directive, inject, input } from '@angular/core';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { _computed, InjectableComponent, TokenizedType } from '@ng-atomic/core';

@TokenizedType()
@Directive({ standalone: true, selector: 'molecules-loading-box' })
export class LoadingBoxMoleculeStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    return () => ({
      loadingMessage: 'initializing...'
    });
  }, ['components', 'molecules', 'loading-box']);
  readonly config = LoadingBoxMoleculeStore.Config.inject();
  readonly loadingMessage = input(_computed(() => this.config().loadingMessage));
}

@Component({
  selector: 'molecules-loading-box',
  standalone: true,
  imports: [],
  template: `
  <span class="initializing">決済フォーム初期化中</span>
  <div class="loading-dots">
    @for (i of [0, 1, 2]; track $index) { <div class="dot"></div> }
  </div>
  `,
  styleUrl: './loading-box.molecule.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: LoadingBoxMoleculeStore,
      inputs: ['loadingMessage'],
    }
  ]
})
export class LoadingBoxMolecule {
  protected store = inject(LoadingBoxMoleculeStore);
}
