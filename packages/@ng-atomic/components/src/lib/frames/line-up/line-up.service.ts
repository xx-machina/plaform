import { Injectable, signal } from "@angular/core";
import { LineUpFrame } from "./line-up.frame";
import { takeUntilDestroyed, toObservable } from "@angular/core/rxjs-interop";
import { distinctUntilChanged } from "rxjs";

interface State {
  [scope: string]: {
    frames: LineUpFrame[];
    sizeMap: Record<number, number>;
  }
}


@Injectable({providedIn: 'root'})
export class LineUpFrameService {
  readonly sizeMap = signal<State>({});
  readonly sizeMap$ = toObservable(this.sizeMap).pipe(
    distinctUntilChanged(),
    takeUntilDestroyed(),
  );

  register(frame: LineUpFrame, scope: string) {
    this.sizeMap.update(record => {
      record[scope] ??= {frames: [], sizeMap: {}};
      record[scope].frames.push(frame);
      return {...record};
    });
  }

  update(frame: LineUpFrame, mainWidth: number, scope: string) {
    const index = this.findIndex(frame, scope);
    this.sizeMap.update(record => {
      record[scope] ??= {frames: [], sizeMap: {}};
      record[scope].sizeMap[index] = mainWidth;
      return {...record};
    })
  }

  unregister(frame: LineUpFrame, scope: string) {
    const index = this.findIndex(frame, scope);
    this.sizeMap.update(record => {
      record[scope].frames = [...record[scope].frames.filter((value) => value !== frame)];
      delete record[scope].sizeMap[index];
      return {...record};
    })
  }

  findIndex(frame: LineUpFrame, scope: string): number {
    return this.sizeMap()[scope].frames.findIndex((value) => value === frame);
  }

  isFirst(frame: LineUpFrame, scope: string): boolean {
    const index = this.findIndex(frame, scope);
    return Math.min(...Object.keys(this.getSizeMap(scope)).map(key => parseInt(key, 10))) === index;
  }

  getSizeMap(scope: string) {
    return this.sizeMap()[scope].sizeMap ?? {};
  }

  getFollowingWidth(scope: string, frame: LineUpFrame): number {
    return Object.entries(this.getSizeMap(scope))
      .filter(([key]) => parseInt(key, 10) >= this.findIndex(frame, scope))
      .reduce((acc, [_, width]) => width + acc, 0);
  }
}
