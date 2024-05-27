import { logging } from "@angular-devkit/core";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoggingService extends logging.IndentLogger {
  constructor() { super('sx-cli'); }
}
