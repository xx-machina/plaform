import { PROMPTS_REGISTER } from "../../cli/core/prompts-registry";
import { TreeEditModule } from "./presenter";
import { TreeEditPrompter } from "./presenter";

export function register() {
  // [
  //   {
  //     provide: PROMPTS_REGISTER,
  //     useValue: () => ({name: 'tree-edit', prompterType: TreeEditPrompter, NgModuleDef: TreeEditModule}),
  //     multi: true,
  //   },
  // ]
}

register();
