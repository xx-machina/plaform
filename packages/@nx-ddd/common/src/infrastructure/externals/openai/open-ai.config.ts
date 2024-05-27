import { InjectionToken, Provider } from "@angular/core";
import { OPEN_AI_SERVICE } from "./open-ai.service";
import { OpenAiServiceImpl } from "./open-ai.service.impl";

export interface OpenAiConfig {
  apiKey: string;
}
export const OPEN_AI_CONFIG = new InjectionToken<OpenAiConfig>('OPENAI_CONFIG');

export function provideOpenAiConfig(useFactory: () => OpenAiConfig): Provider[] {
  return provideOpenaiService(useFactory);
}

export function provideOpenaiService(useFactory: () => OpenAiConfig): Provider[] {
  return [
    { provide: OPEN_AI_SERVICE, useClass: OpenAiServiceImpl, deps: [OPEN_AI_CONFIG] },
    { provide: OPEN_AI_CONFIG, useFactory },
  ];
}
