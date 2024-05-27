import { Renderer } from "../../../cli/renderer";
import { TreeEditPrompter } from "./tree-edit.prompter";
import { TreeEditPrompterPresenter } from "./tree-edit.prompter.presenter";
import { TreeEditPrompterStore } from "./tree-edit.prompter.store";
import { InputStore } from "../stores/input";
import { TreeSelectStore } from "../stores/select";
import { TreeBuilder } from "../services/tree-builder";
import { NgModule } from "@angular/core";

@NgModule({
  providers: [
    TreeEditPrompter,
    TreeEditPrompterPresenter,
    TreeEditPrompterStore,
    TreeSelectStore,
    InputStore,
    Renderer,
    TreeBuilder,
  ],
})
export class TreeEditModule { }
