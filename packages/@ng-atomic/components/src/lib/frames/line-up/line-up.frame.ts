import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Injectable, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LINE_UP_ANIMATIONS } from './line-up.animations';
import { fromResize } from './resize-observer';

enum Mode {
  MAIN = 'Main',
  BOTH = 'Both',
  NEXT = 'Next',
}

@Injectable({providedIn: 'root'})
export class LineUpFrameService {
  frames: LineUpFrame[] = [];

  register(frame: LineUpFrame) {
    this.frames.push(frame);
  }

  unregister(frame: LineUpFrame) {
    this.frames = this.frames.slice(0, this.findIndex(frame));
  }

  findIndex(frame: LineUpFrame): number {
    return this.frames.findIndex((value) => value === frame);
  }

  propagate(frame: LineUpFrame): void {
    const target = this.frames?.[this.findIndex(frame) - 1];
    target?.refresh();
  }
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
  ],
  selector: 'frames-line-up',
  template: `
    <div class="main" [@modeChangeForMain]="mode" #main>
      <ng-content select="[main]"></ng-content>
    </div>
    <div class="next" [@modeChangeForNext]="mode" #next>
      <ng-content select="[next]"></ng-content>
    </div>
  `,
  styleUrls: ['./line-up.frame.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: LINE_UP_ANIMATIONS,
})
export class LineUpFrame implements OnInit, OnDestroy {
  Mode = Mode;
  mode = Mode.MAIN;

  private readonly refresh$ = new ReplaySubject<void>(1);
  private readonly destroy$ = new ReplaySubject<void>(1);
  private readonly hasNext$ = new BehaviorSubject(false);  


  private _hasNext = false;
  @HostBinding('attr.has-next')
  @Input()
  set hasNext(_hasNext: boolean) {
    this.hasNext$.next(_hasNext);
    this._hasNext = _hasNext;
  };
  get hasNext(): boolean {
    return this._hasNext;
  }

  @Input()
  minNextWidth: number = 360;

  @ViewChild('next', {static: true})
  nextElementRef!: ElementRef;

  constructor(private service: LineUpFrameService) { }

  ngOnInit(): void {
    this.service.register(this);
    this.refresh();
    
    combineLatest([
      this.hasNext$, 
      fromResize(this.nextElementRef),
      this.refresh$,
    ]).pipe(takeUntil(this.destroy$)).subscribe(([hasNext, width]) => {
      this.mode = this.resolveMode(hasNext, width);
      setTimeout(() => this.service.propagate(this), 0);
    });
  }

  ngOnDestroy(): void {
    this.service.unregister(this);
    this.destroy$.next(); 
  }

  refresh() {
    this.refresh$.next();
  }

  private resolveMode(hasNext: boolean, width: number): Mode {
    if (hasNext && width <= this.minNextWidth) return Mode.BOTH;
    return hasNext ? Mode.NEXT : Mode.MAIN;
  }
}
