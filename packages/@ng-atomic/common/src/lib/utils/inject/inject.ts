import { inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { injectUiConfig$ } from "@ng-atomic/common/services/ui";
import { Observable, map, shareReplay } from "rxjs";

export function injectIsRootAndDrawerMenu$(): Observable<boolean> {
  const route = inject(ActivatedRoute);
  route.pathFromRoot.length === 4;
  return injectUiConfig$(['frames', 'sideNav', 'frameType']).pipe(
    map((sideNavType) => {
      return route.pathFromRoot.length === 4 && sideNavType === 'drawer';
    }),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}

export interface NgAtomicContext {
  isRoot: boolean;
  isDrawerMenu: boolean;
}

export function injectNgAtomicContext(): Observable<NgAtomicContext> {
  const route = inject(ActivatedRoute);
  route.pathFromRoot.length === 4;
  return injectUiConfig$(['frames', 'sideNav', 'frameType']).pipe(
    map((sideNavType) => ({
      isRoot: route.pathFromRoot.length === 4,
      isDrawerMenu: sideNavType === 'drawer',
    })),
    shareReplay(1),
    takeUntilDestroyed(),
  );
}