import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoggingQueueService {
  private queue: string[] = [];

  constructor() { }

  push(item) {
    this.queue.push(item);
  }

  forEach(callback) {
    this.queue.forEach(callback);
  }

  clear() {
    this.queue = [];
  }
}
