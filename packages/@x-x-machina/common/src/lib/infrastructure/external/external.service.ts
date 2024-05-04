import { Injectable } from "@nx-ddd/core";
import { AzureOpenAiAdapter } from "@schematics-x/core/adapters/azure-open-ai";
import { BaseAdapter } from "@schematics-x/core/adapters/base";
import { OpenAiAdapter } from "@schematics-x/core/adapters/open-ai";
import { AiConfig, AiType, AzureOpenAiConfig, OpenAiConfig } from "@x-x-machina/common/domain/models";

@Injectable({providedIn: 'root'})
export class ExternalService {

  getAiAdapter(aiConfig: AiConfig): BaseAdapter {
    return aiConfig.type === AiType.AZURE_OPEN_AI
      ? new AzureOpenAiAdapter({...aiConfig.config as AzureOpenAiConfig})
      : new OpenAiAdapter({...aiConfig.config as OpenAiConfig});
  }
}
