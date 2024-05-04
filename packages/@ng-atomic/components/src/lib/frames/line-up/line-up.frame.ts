import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostBinding, Injectable, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { interval, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, scan, shareReplay, startWith, switchMap} from 'rxjs/operators';
import { LINE_UP_ANIMATIONS } from './line-up.animations';
import { fromResize } from './resize-observer';

export interface LineUpFrameEntry {
  type: 'add' | 'remove';
  scope: string;
  index: number;
  mainWidth?: number;
}

@Injectable({providedIn: 'root'})
export class LineUpFrameService {
  frames: LineUpFrame[] = [];

  readonly entries$ = new Subject<LineUpFrameEntry>();
  readonly sizeMap$ = this.entries$.pipe(
    scan((acc, value) => {
      if (value.type === 'remove') {
        const map = acc.get(value.scope);
        map?.delete(value.index);
        if (map?.size === 0) acc.delete(value.scope);
        return acc;
      } else {
        const map = acc.get(value.scope) ?? new Map<number, number>();
        map.set(value.index, value.mainWidth);
        acc.set(value.scope, map);
        return acc;
      }
    }, new Map() as Map<string, Map<number, number>>),
    filter((map) => [...map.values()].map(map => [...map.keys()]).flat().length === this.frames.length),
    shareReplay(1),
  );
  readonly sizeMap = toSignal(this.sizeMap$);

  mapToContentWidth(scope: string, index: number) {
    return this.sizeMap$.pipe(
      map((map) => map.get(scope) ?? new Map<number, number>()),
      map((map) => {
        const keys = [...map.keys()].filter(key => key >= index);
        return keys.reduce((acc, key) => map.get(key) + acc, 0);
      }),
      distinctUntilChanged(),
      shareReplay(1),
    );
  }

  register(frame: LineUpFrame, mainWidth?: number) {
    this.frames.push(frame);
  }

  update(frame: LineUpFrame, mainWidth: number) {
    this.entries$.next({type: 'add', scope: frame.scope, index: frame.index, mainWidth});
  }

  unregister(frame: LineUpFrame) {
    const index = this.findIndex(frame);
    this.frames = this.frames.filter((value) => value !== frame);
    this.entries$.next({type: 'remove', scope: frame.scope, index});
  }

  findIndex(frame: LineUpFrame): number {
    return this.frames.findIndex((value) => value === frame);
  }

  isFirst(frame: LineUpFrame): boolean {
    const index = this.findIndex(frame);
    const keys = [...(this.sizeMap().get(frame.scope) ?? new Map()).keys()];
    return Math.min(...keys) === index;
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  selector: 'frames-line-up',
  template: `
    <div class="main content" #main><ng-content select=[main]></ng-content></div>
    <div class="next content" *ngIf="hasNext" @hasNext><ng-content select=[next]></ng-content></div>
  `,
  styleUrls: ['./line-up.frame.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: LINE_UP_ANIMATIONS,
})
export class LineUpFrame implements OnInit, OnDestroy {
  private service = inject(LineUpFrameService);
  private el = inject(ElementRef);

  @HostBinding('attr.has-next')
  @Input()
  hasNext: boolean

  @Input()
  scope = 'default';

  @ViewChild('main', {static: false})
  protected mainEl!: ElementRef;

  // TODO(@nontangent): interval is not the best way to do this
  readonly mainWidth$ = interval(500).pipe(
    filter(() => !!this.mainEl),
    map(() => this.mainEl.nativeElement.clientWidth),
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  readonly width$ = this.service.sizeMap$.pipe(
    switchMap(() => this.service.mapToContentWidth(this.scope, this.index)),
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  get index(): number {
    return this.service.findIndex(this);
  }

  ngOnInit(): void {
    this.service.register(this, 0);
  }

  ngAfterViewInit(): void {
    this.mainWidth$.subscribe((width) => this.service.update(this, width));
    this.width$.pipe(filter(() => this.service.isFirst(this))).subscribe((width) => {
      const delta = this.el.nativeElement.clientWidth - width;
      this.el.nativeElement.style.setProperty('--translate-x', `${Math.min(delta, 0)}px`);
    });
  }

  ngOnDestroy(): void {
    this.service.unregister(this);
  }
}
