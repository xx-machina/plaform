import { Component, Directive, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { MarkdownModule } from 'ngx-markdown';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';

enum ActionId {
  BACK = '[@ng-atomic/components/templates/term] Back',
}

@Directive({ standalone: true })
export class TermTemplateStore {
  readonly navStartActions = [
    {
      id: ActionId.BACK,
      name: '戻る',
      icon: 'arrow_back',
    },
  ];
  readonly navEndActions = [];
}

@Component({
  selector: 'templates-term',
  standalone: true,
  imports: [
    CommonModule,
    NavigatorOrganism,
    HeaderMolecule,
    MarkdownModule,
    ScrollFrame,
  ],
  template: `
  <frames-scroll>
    <organisms-navigator 
      [startActions]="store.navStartActions"
      [endActions]="store.navEndActions"
      (action)="dispatch($event)"
      navigator
    >
      <molecules-header [title]="title"></molecules-header>
    </organisms-navigator>
    <markdown [src]="src" contents></markdown>
  </frames-scroll>
  `,
  styleUrls: ['./term.template.scss'],
  hostDirectives: [TermTemplateStore],
})
export class TermTemplate extends NgAtomicComponent {
  static readonly ActionId = ActionId;

  protected store = inject(TermTemplateStore);

  @Input()
  title!: string;

  @Input()
  src!: string;
}
