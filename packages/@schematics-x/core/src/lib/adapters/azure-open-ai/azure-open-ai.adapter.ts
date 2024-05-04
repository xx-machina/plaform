import { Inject, Injectable, InjectionToken } from "@nx-ddd/core";
// import { OpenAIApi } from "openai";
import { BaseAdapter, Role } from "../base";

export interface AzureOpenAiConfig {
  baseUrl: string;
  token: string;
}

export const AZURE_OPEN_AI_CONFIG = new InjectionToken<AzureOpenAiConfig>('[@schematics-x] Azure Open Ai Config');

@Injectable()
export class AzureOpenAiAdapter extends BaseAdapter {
  constructor(
    @Inject(AZURE_OPEN_AI_CONFIG) private config: AzureOpenAiConfig,
  ) { super(); }

  async embedding(input: string, model = 'text-embedding-ada-002'): Promise<number[]> {
    const openAi = this.getOpenAiClient(model);
    const res = await openAi.createEmbedding({model, input}, this.options)
      .catch(error => { throw error; });
    return res.data.data?.[0].embedding;
  }

  async complete(prompt: string, {
    model = 'gpt-35-turbo',
    max_tokens = 1024,
    stop = '\n',
  }): Promise<string> {
    const openAi = this.getOpenAiClient(model);
    const res = await openAi.createCompletion({
      model,
      prompt,
      temperature: 0,
      stop,
      max_tokens,
    }, this.options);
    return res.data.choices?.[0].text;
  }

  async chatComplete(messages: { role: Role, content: string }[]): Promise<string> {
    const openAi = this.getOpenAiClient('gpt-35-turbo');
    const res = await openAi.createChatCompletion({
      model: 'gpt-35-turbo',
      messages,
      temperature: 0,
      // stop: '\n',
      max_tokens: 1024,
      top_p: 1,
    }, {
      ...this.options,
      params: {
        'api-version': '2023-03-15-preview',
      },
    }).catch((error) => {
      console.error(error);
      throw error;
    });

    console.debug('choices:', res.data.choices);
    return res.data.choices?.[0].message.content;
  }

  private getOpenAiClient(model: string): OpenAIApi {
    const url = this.getBaseUrl(model);
    return new OpenAIApi(undefined, url);
  }

  private getBaseUrl(model: string): string {
    return `${this.config.baseUrl}/openai/deployments/${model}`;
  }

  private get options() {
    return {
      headers: {
        'api-key': this.config.token,
      },
      params: {
        'api-version': '2022-12-01',
      },
    };
  }
}
