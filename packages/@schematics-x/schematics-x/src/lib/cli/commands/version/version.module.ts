import { NgModule } from "@angular/core";
import { VersionCommand } from "./version.command";

@NgModule({
  providers: [VersionCommand],
})
export class VersionModule { }