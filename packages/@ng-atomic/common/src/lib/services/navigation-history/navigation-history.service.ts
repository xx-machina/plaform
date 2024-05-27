import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { fromEvent } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavigationHistoryService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  protected readonly history = signal<string[]>([]);
  readonly hasPrevHistory = computed(() => this.history().length > 1);
  readonly isInitial = computed(() => !this.hasPrevHistory());

  pop() {
    this.history.update(history => (history.pop(), [...history]));
  }

  push(url: string) {
    this.history.update(history => ([...history, url]));
  }

  replace(url: string) {
    this.history.update(history => (history.pop(), [...history, url]));
  }

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      fromEvent(window, 'popstate').subscribe(() => this.pop());
      let replaceUrl = false;
      this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          if (this.router.getCurrentNavigation()?.extras?.replaceUrl) {
            replaceUrl = true;
          }
        } else if (event instanceof NavigationEnd) {
          if (replaceUrl) {
            this.replace(event.url);
            replaceUrl = false;
          } else {
            this.push(event.url);
          }
        }
      });
    }
  }
}
