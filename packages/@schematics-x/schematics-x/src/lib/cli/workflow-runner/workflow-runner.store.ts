import { Injectable } from "@angular/core";

@Injectable()
export class WorkflowRunnerStore {
  error: boolean = false;
  nothingDone = true;
}
