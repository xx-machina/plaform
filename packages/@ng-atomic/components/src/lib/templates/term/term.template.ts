import { Component, Directive, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { MarkdownModule } from 'ngx-markdown';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { InjectableComponent, NgAtomicComponent } from '@ng-atomic/core';

enum ActionId {
  BACK = '[@ng-atomic/components/templates/term] Back',
}

@Directive({ standalone: true })
export class TermTemplateStore extends InjectableComponent {
  readonly navStartActions = input([
    {
      id: ActionId.BACK,
      name: '戻る',
      icon: 'arrow_back',
    },
  ]);
  readonly navEndActions = input([]);
  readonly title = input('title');
  readonly src = input('title');
  readonly data = input('data');
}

@Component({
  selector: 'templates-term',
  standalone: true,
  imports: [
    NavigatorOrganism,
    HeaderMolecule,
    MarkdownModule,
    ScrollFrame,
  ],
  template: `
  <frames-scroll>
    <organisms-navigator 
      [startActions]="store.navStartActions()"
      [endActions]="store.navEndActions()"
      (action)="dispatch($event)"
      navigator
    >
      <molecules-header [title]="store.title()"></molecules-header>
    </organisms-navigator>
    @if (store.src()) {
      <markdown [src]="store.src()" contents />
    } @else {
      <markdown [data]="store.data()" contents />
    }
  </frames-scroll>
  `,
  styleUrls: ['./term.template.scss'],
  hostDirectives: [
    {
      directive: TermTemplateStore,
      inputs: ['navStartActions', 'navEndActions', 'title', 'src', 'data'],
    }
  ],
})
export class TermTemplate extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  protected store = inject(TermTemplateStore);
}
