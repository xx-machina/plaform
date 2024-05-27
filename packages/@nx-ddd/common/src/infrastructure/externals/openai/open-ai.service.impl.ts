import { Inject, Injectable } from "@angular/core";
import { OpenAI } from "openai";
import { OPEN_AI_CONFIG, OpenAiConfig } from "./open-ai.config";

@Injectable({providedIn: 'root'})
export class OpenAiServiceImpl extends OpenAI {
  constructor(@Inject(OPEN_AI_CONFIG) config: OpenAiConfig) {
    super({apiKey: config.apiKey});
  }
}
