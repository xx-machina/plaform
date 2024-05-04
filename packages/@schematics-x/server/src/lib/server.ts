import { AiService } from '@schematics-x/core/ai';
import { RedisService } from './redis';
import { Context } from '@schematics-x/server/models';
import { Injectable } from '@nx-ddd/core';


@Injectable({providedIn: 'root'})
export class ContextServer {
  constructor(
    private ai: AiService,
    private redis: RedisService,
  ) { }

  async onInit(): Promise<void> {
    await this.redis.onInit();
  }

  async onDestroy(): Promise<void> {
    await this.redis.onDestroy();
  }

  async listContexts(): Promise<Context[]> {
    return [];
  }

  async createContext(context: Context): Promise<void> {
    const embedding = await this.ai.embedding(context.instructions);
    return this.redis.setContext({...context, embedding});
  }
  async getContext(id: string): Promise<Context> {
    return this.redis.getContext(id);
  }

  async updateContext() {

  }

  async searchContexts(instructions: string): Promise<Context[]> {
    const embedding = await this.ai.embedding(instructions);
    return this.redis.searchContexts(embedding);
  }

  async searchContext(instructions: string): Promise<Context> {
    return (await this.searchContexts(instructions))[0];
  }
}
