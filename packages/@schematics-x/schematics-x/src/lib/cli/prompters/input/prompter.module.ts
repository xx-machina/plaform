import { NgModule } from "@angular/core";
import { RendererModule } from "../../renderer";
import { Presenter } from "./presenter";
import { Prompter } from "./prompter";
import { PrompterStore } from "./prompter.store";

@NgModule({
  imports: [
    RendererModule,
  ],
  providers: [
    Prompter,
    Presenter,
    PrompterStore,
  ]
})
export class PrompterModule { }
