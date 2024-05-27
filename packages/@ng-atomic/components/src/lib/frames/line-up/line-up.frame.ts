import { ChangeDetectionStrategy, Component, Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject, input, viewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, startWith, switchMap } from 'rxjs/operators';
import { LINE_UP_ANIMATIONS } from './line-up.animations';
import { LineUpFrameService } from './line-up.service';
import { fromResize } from './resize-observer';
import { combineLatest, fromEvent, of } from 'rxjs';

@Directive({standalone: true, selector: 'frames-line-up'})
export class LineUpFrameStore {
  readonly scope = input('default');
  readonly hasNext = input(false);
}

@Component({
  standalone: true,
  imports: [],
  selector: 'frames-line-up',
  template: `
    <div class="main" #main><ng-content select=[main] /></div>
    @if (store.hasNext()) {
      <div class="next" @hasNext><ng-content select=[next] /></div>
    }
  `,
  styleUrls: ['./line-up.frame.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: LINE_UP_ANIMATIONS,
  hostDirectives: [
    {
      directive: LineUpFrameStore,
      inputs: ['scope', 'hasNext'],
    },
  ],
  host: {
    'attr.has-next': 'store.hasNext()',
  }
})
export class LineUpFrame implements OnInit, OnDestroy {
  protected store = inject(LineUpFrameStore);
  private service = inject(LineUpFrameService);
  private el = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);

  readonly resizeWindow$ = of(null).pipe(
    switchMap(() => {
      return isPlatformBrowser(this.platformId)
        ? fromEvent(window, 'resize').pipe(startWith(null))
        : of(null);
    }),
  )

  readonly elWidth$ = this.resizeWindow$.pipe(
    switchMap(() => fromResize(this.el).pipe(startWith(null))),
    map(() => this.el.nativeElement?.clientWidth ?? 0),
    takeUntilDestroyed(),
  );
  
  readonly main = viewChild('main', {read: ElementRef});
  readonly main$ = toObservable(this.main);
  readonly mainWidth$ = combineLatest({
    main: this.main$,
    resize: this.resizeWindow$
  }).pipe(
    switchMap(({main}) => fromResize(main).pipe(startWith(null))),
    map(() => this.main()),
    map((main) => main?.nativeElement?.clientWidth ?? 0),
    takeUntilDestroyed(),
  );
  readonly allWidth$ = combineLatest({
    map: this.service.sizeMap$,
    window: this.resizeWindow$
  }) .pipe(
    map(() => this.service.getFollowingWidth(this.store.scope(), this)),
    takeUntilDestroyed(),
  );

  readonly delta$ = combineLatest({
    el: this.elWidth$,
    all: this.allWidth$,
  }).pipe(
    filter(() => this.service.isFirst(this, this.store.scope())),
    map(({el, all}) => Math.min(el - all, 0)),
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  ngOnInit(): void {
    this.service.register(this, this.store.scope());
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.mainWidth$.subscribe((width) => this.service.update(this, width, this.store.scope()));
      this.delta$.subscribe((delta) => this.setTranslateX(delta));
    }
  }

  ngOnDestroy(): void {
    this.service.unregister(this, this.store.scope());
  }

  protected setTranslateX(value: number) {
    this.el.nativeElement.style.setProperty('--translate-x', `${value}px`);
  }
}
