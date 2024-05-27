import { NgModule } from "@angular/core";
import { PromiseQueue } from "./promise-queue";

@NgModule({
  imports: [],
  providers: [
    { provide: PromiseQueue, useValue: new PromiseQueue() },
  ],
})
export class PromiseQueueModule { }
