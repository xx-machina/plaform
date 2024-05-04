import { NxModule } from "@nx-ddd/core";
import { AZURE_OPEN_AI_CONFIG, AzureOpenAiConfig, AzureOpenAiAdapter } from "./azure-open-ai.adapter";
import { BaseAdapter } from "../base";

@NxModule({
  providers: [
    {
      provide: BaseAdapter,
      useClass: AzureOpenAiAdapter,
    },
  ],
})
export class AzureOpenAiModule {
  static forRoot(config: AzureOpenAiConfig) {
    return {
      nxModule: AzureOpenAiModule,
      providers: [
        { provide: AZURE_OPEN_AI_CONFIG, useValue: config },
      ],
    };
  }
}
