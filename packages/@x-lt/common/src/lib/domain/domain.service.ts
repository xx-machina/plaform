import { Injectable } from "@nx-ddd/core/di";
import { EntryService } from "./services/entry";

@Injectable({providedIn: 'root'})
export class DomainService {
  constructor(public entry: EntryService) { }
}