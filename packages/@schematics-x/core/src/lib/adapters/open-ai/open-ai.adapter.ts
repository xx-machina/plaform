import { Inject, Injectable, InjectionToken } from "@nx-ddd/core";
import { OpenAI } from "openai";
import { BaseAdapter, Role } from "../base";

export interface OpenAiConfig {
  apiKey: string;
}

export const OPEN_AI_CONFIG = new InjectionToken<OpenAiConfig>('AI CONFIG');

@Injectable()
export class OpenAiAdapter extends BaseAdapter {
  private openAi = new OpenAI({apiKey: this.config.apiKey});

  constructor(
    @Inject(OPEN_AI_CONFIG) private config: OpenAiConfig,
  ) { super() }

  async embedding(input: string, model = 'text-embedding-ada-002'): Promise<number[]> {
    const res = await this.openAi.embeddings.create({model, input});
    return res.data?.[0].embedding;
  }

  async complete(prompt: string, {
    model = 'text-ada-001',
    max_tokens = 1024,
    stop = '\n',
  }): Promise<string> {
    const res = await this.openAi.completions.create({
      model,
      prompt,
      temperature: 0,
      stop,
      max_tokens,
    });
    return res.choices?.[0].text;
  }

  async chatComplete(messages: { role: Role, content: string }[]): Promise<string> {
    const res = await this.openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0,
      max_tokens: 1024,
      top_p: 1,
    }).catch(error => {
      console.error(error.response.data);
      throw error;
    });
    return res.choices?.[0].message.content;
  }
}
