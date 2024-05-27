import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

export function walkActivatedRoute(route: ActivatedRoute, callback: (route: ActivatedRoute) => boolean): void {
  if (!callback(route)) return;
  route.children.forEach(child => walkActivatedRoute(child, callback));
}

@Injectable({providedIn: 'root'})
export class RouterService extends Router {
  readonly router = inject(Router);
  readonly events$ = this.router.events;

  back(): void {
    history.back()
  }
}
