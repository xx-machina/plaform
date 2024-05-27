import '@angular/compiler';
import { Provider } from '@angular/core';

export class RootProviderService {
  private static readonly _providers: Provider[] = [];

  static register(providers: Provider[]) {
    providers.forEach(provider => this._providers.push(provider));
  }

  static clear() {
    while(this._providers.length) {
      this._providers.pop();
    }
  }

  static get providers(): Provider[] {
    return this._providers;
  }
}
