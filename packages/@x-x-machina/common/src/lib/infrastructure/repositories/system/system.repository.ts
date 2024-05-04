import { Injectable } from "@nx-ddd/core";

@Injectable({providedIn: 'root'})
export class SystemRepository {
  protected entityName: string = 'system';
}
