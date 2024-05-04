import { Injectable } from "@nx-ddd/core/di";
import { FirstService } from './first';
import { SecondService } from './second';

@Injectable({providedIn: 'root'})
export class SelectionService {
  constructor(
    public first: FirstService,
    public second: SecondService,
  ) { }
}