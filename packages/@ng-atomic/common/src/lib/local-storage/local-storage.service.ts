import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class LocalStorageService<T> {
  save(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  load(key: string): T | null {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  }
}
