import { PROMPTS_REGISTER } from "../../cli/core/prompts-registry";
import { HistoryInputPrompter } from "./history-input.prompter";

export function register() {
  // {
  //   provide: PROMPTS_REGISTER,
  //   useValue: () => ({
  //     name: 'suggest',
  //     prompterType: HistoryInputPrompter,
  //   }),
  //   multi: true,
  // }
}

register();
