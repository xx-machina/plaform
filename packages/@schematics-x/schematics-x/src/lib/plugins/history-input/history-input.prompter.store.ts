import { Injectable } from "@angular/core";
import { PrompterStore } from '../../cli/prompters/input/prompter.store';

@Injectable()
export class HistoryInputPrompterStore extends PrompterStore {
  constructor() {
    super();
  }
}