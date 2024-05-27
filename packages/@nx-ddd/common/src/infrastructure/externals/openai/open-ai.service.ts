import { InjectionToken, inject } from "@angular/core";
import type { OpenAiServiceImpl } from './open-ai.service.impl';

export const OPEN_AI_SERVICE = new InjectionToken<OpenAiServiceImpl>('Open Ai Service');

export function injectOpenAiService(): OpenAiServiceImpl {
  return inject(OPEN_AI_SERVICE, {optional: true}) ?? {} as OpenAiServiceImpl;
}
