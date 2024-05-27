import { LifeCycleEvent } from "@angular-devkit/schematics/src/workflow";
import { Injectable } from "@angular/core";
import { LoggingService } from "../../../services/logging";
import { LoggingQueueService } from "../../../services/logging-queue";
import { WorkflowRunnerStore } from "../../workflow-runner.store";

@Injectable({providedIn: 'root'})
export class LifeCycleEventHandler {
  constructor(
    protected loggingQueue: LoggingQueueService,
    protected logger: LoggingService,
    protected store: WorkflowRunnerStore,
  ) { }

  handle(event: LifeCycleEvent) {
    if (event.kind == 'workflow-end' || event.kind == 'post-tasks-start') {
      if (!this.store.error) {
        this.loggingQueue.forEach((log) => this.logger.info(log));
      }

      this.loggingQueue.clear();
      this.store.error = false;
    }
  }
}