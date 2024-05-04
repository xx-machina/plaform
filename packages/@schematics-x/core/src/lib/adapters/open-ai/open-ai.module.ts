import { NxModule } from "@nx-ddd/core";
import { BaseAdapter } from "../base";
import { OpenAiAdapter, OpenAiConfig, OPEN_AI_CONFIG } from "./open-ai.adapter";

@NxModule({
  providers: [
    {
      provide: BaseAdapter,
      useClass: OpenAiAdapter,
    }
  ],
})
export class OpenAiModule {
  static forRoot(config: OpenAiConfig) {
    return {
      module: OpenAiModule,
      providers: [
        {
          provide: OPEN_AI_CONFIG,
          useClass: config,
        }
      ],
    };
  }
}
