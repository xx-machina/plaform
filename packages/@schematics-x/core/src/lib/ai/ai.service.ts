import { Inject, Injectable, InjectionToken } from "@nx-ddd/core";
import { Configuration, OpenAIApi } from "openai";

export interface AiConfig {
  token: string;
}

export const AI_CONFIG = new InjectionToken<AiConfig>('AI CONFIG');

@Injectable({providedIn: 'root'})
export class AiService {
  private openAiConfig = new Configuration({apiKey: this.config.token});
  private openAi = new OpenAIApi(this.openAiConfig);

  constructor(
    @Inject(AI_CONFIG) private config: AiConfig,
  ) { }

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
}
