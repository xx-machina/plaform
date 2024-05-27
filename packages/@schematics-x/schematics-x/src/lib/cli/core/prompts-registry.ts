import { Inject, Injectable, InjectionToken, Injector, Optional } from "@angular/core";
import { Provider } from "@angular/core";
import { registerPrompt } from "inquirer";
import { InquirerAdapter } from "../adapters/inquirer";
import { SX_SCREEN } from "../renderer";
import { bootstrap } from "@nx-ddd/core";

export class PrompterFactory {
  constructor(
    private prompterType: any,
    private NgModuleDef: any,
  ) { }
  
  create(injector: Injector) {
    return injector.get(this.prompterType);
  }
}

export function buildPrompterFactory(prompterType, NgModuleDef) {
  return new PrompterFactory(prompterType, NgModuleDef);
}

export type PromptRegister = () => {name: string, prompterType: any, NgModuleDef: any};
export const PROMPTS_REGISTER = new InjectionToken<PromptRegister>('PromptsRegister');

export async function createInjector(providers: Provider[] = [], parentInjector?: Injector) {
  // TODO(nontangent): Add parentInjector
  return bootstrap(providers);
}


@Injectable()
export class PromptsRegistry {
  constructor(
    protected injector: Injector,
    @Optional() @Inject(PROMPTS_REGISTER) registers?: PromptRegister[]
  ) {
    registers ??= []
    registers.forEach((register) => {
      const { name, prompterType, NgModuleDef } = register();
      this.register(name, prompterType, NgModuleDef);
    });
  }

  register(name: string, PrompterType: any, PrompterModule) {
    const factory = buildPrompterFactory(PrompterType, PrompterModule);

    registerPrompt(name, InquirerAdapter(async (screen) => {
      const injector = await createInjector([{ provide: SX_SCREEN, useValue: screen }], this.injector);
      return factory.create(injector);
    }));
  }
}

// GlobalProvidersManager.register([
//   {
//     provide: PROMPTS_REGISTER,
//     useValue: () => ({name: 'suggest', prompterType: Prompter, NgModuleDef: PrompterModule}),
//     multi: true,
//   },
//   {
//     provide: PROMPTS_REGISTER,
//     useValue: () => ({name: 'suggest', prompterType: HistoryInputPrompter, NgModuleDef: HistoryInputModule}),
//     multi: true,
//   },
// ]);