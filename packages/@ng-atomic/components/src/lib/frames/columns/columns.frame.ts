import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, NgModule, PLATFORM_ID, TemplateRef, contentChild, inject, input } from '@angular/core';
import { makeConfig } from '@ng-atomic/common/services/ui';
import { InjectableComponent, NgAtomicComponent, TokenizedType, _computed } from '@ng-atomic/core';

@TokenizedType()
@Directive({standalone: true, selector: 'frames-columns'})
export class ColumnsFrameStore extends InjectableComponent {
  static readonly Config = makeConfig(() => (_, context) => {
    const getType = (): 'row' | 'column' => {
      switch (context.breakpoint) {
        case 'xSmall':
        case 'small': return 'column';
        default: return 'row';
      }
    }
    return { type: getType() };
  }, ['components', 'frames', 'columns']);
  readonly config = ColumnsFrameStore.Config.inject();
  readonly type = input<'row' | 'column'>(_computed(() => this.config().type));
}

@Directive({standalone: true, selector: '[left], [leftColumn]'})
export class LeftColumn {
  readonly platformId = inject(PLATFORM_ID);
  readonly isPlatformBrowser = isPlatformBrowser(this.platformId);
  readonly templateRef = inject(TemplateRef<unknown>)
}

@Directive({
  standalone: true,
  selector: '[main], [mainColumn]',
})
export class MainColumn {
  readonly platformId = inject(PLATFORM_ID);
  readonly isPlatformBrowser = isPlatformBrowser(this.platformId);
  readonly templateRef = inject(TemplateRef<unknown>)
}

@Directive({standalone: true, selector: '[right], [rightColumn]'})
export class RightColumn {
  readonly platformId = inject(PLATFORM_ID);
  readonly isPlatformBrowser = isPlatformBrowser(this.platformId);
  readonly templateRef = inject(TemplateRef<unknown>)
}

@Component({
  selector: 'frames-columns',
  standalone: true,
  imports: [
    NgTemplateOutlet,
  ],
  template: `
    @if(left()?.templateRef && left()?.isPlatformBrowser) {
      <div class="left container">
        <ng-container [ngTemplateOutlet]="left()?.templateRef" />
      </div>
    }

    @if (main()?.templateRef && main()?.isPlatformBrowser) {
      <main class="main container">
        <ng-container [ngTemplateOutlet]="main()?.templateRef" />
      </main>
    }
    
    @if (right()?.templateRef && right()?.isPlatformBrowser) {
      <div class="right container">
        <ng-container [ngTemplateOutlet]="right()?.templateRef" />
      </div>
    }
  `,
  styleUrl: './columns.frame.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ColumnsFrameStore,
      inputs: ['type'],
    }
  ],
  host: {
    '[attr.type]': 'store.type()',
  },
})
export class ColumnsFrame extends NgAtomicComponent {
  protected readonly platformId = inject(PLATFORM_ID);
  protected readonly store = inject(ColumnsFrameStore);
  protected readonly left = contentChild(LeftColumn);
  protected readonly main = contentChild(MainColumn);
  protected readonly right = contentChild(RightColumn);
}

@NgModule({
  imports: [
    // ColumnsFrameStore,
    ColumnsFrame,
    LeftColumn,
    MainColumn,
    RightColumn,
  ],
  exports: [
    // ColumnsFrameStore,
    ColumnsFrame,
    LeftColumn,
    MainColumn,
    RightColumn,
  ]
})
export class ColumnsFrameModule { }
