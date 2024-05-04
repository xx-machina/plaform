import { Inject, Injectable, InjectionToken } from "@nx-ddd/core";
import { Configuration, OpenAIApi } from "openai";
import { BaseAdapter, Role } from "../base";

export interface OpenAiConfig {
  token: string;
}

export const OPEN_AI_CONFIG = new InjectionToken<OpenAiConfig>('AI CONFIG');

@Injectable()
export class OpenAiAdapter extends BaseAdapter {
  private openAiConfig = new Configuration({apiKey: this.config.token});
  private openAi = new OpenAIApi(this.openAiConfig);

  constructor(
    @Inject(OPEN_AI_CONFIG) private config: OpenAiConfig,
  ) { super() }

  async embedding(input: string, model = 'text-embedding-ada-002'): Promise<number[]> {
    const res = await this.openAi.createEmbedding({model, input});
    return res.data.data?.[0].embedding;
  }

  async complete(prompt: string, {
    model = 'text-ada-001',
    max_tokens = 1024,
    stop = '\n',
  }): Promise<string> {
    const res = await this.openAi.createCompletion({
      model,
      prompt,
      temperature: 0,
      stop,
      max_tokens,
    });
    return res.data.choices?.[0].text;
  }

  async chatComplete(messages: { role: Role, content: string }[]): Promise<string> {
    const res = await this.openAi.createChatCompletion({
      model: 'gpt-35-turbo',
      messages,
      temperature: 0,
      stop: '\n',
      max_tokens: 1024,
    });
    return res.data.choices?.[0].message.content;
  }
}
