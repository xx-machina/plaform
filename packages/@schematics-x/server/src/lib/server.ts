import { BaseAdapter, Role } from '@schematics-x/core/adapters/base';
import { RedisService } from './redis';
import { Context } from '@schematics-x/server/models';
import { Injectable } from '@nx-ddd/core';


@Injectable({providedIn: 'root'})
export class ContextServer {
  constructor(
    private ai: BaseAdapter,
    private redis: RedisService,
  ) { }

  async onInit(): Promise<void> {
    await this.redis.onInit();
  }

  async onDestroy(): Promise<void> {
    await this.redis.onDestroy();
  }

  async listContexts(): Promise<Context[]> {
    return this.redis.list();
  }

  async createContext(context: Context): Promise<void> {
    const embedding = await this.ai.embedding(context.instructions);
    return this.redis.setContext({...context, embedding});
  }

  async getContext(id: string): Promise<Context> {
    return this.redis.getContext(id);
  }

  async existsContext(id: string): Promise<boolean> {
    return this.redis.existsContext(id);
  }

  async updateContext(partial: Partial<Context> & {id: string}) {
    const context = await this.getContext(partial.id);
    return this.redis.setContext({...context, ...partial});
  }

  async searchContexts(instructions: string): Promise<Context[]> {
    const embedding = await this.ai.embedding(instructions);
    return this.redis.searchContexts(embedding);
  }

  async searchContext(instructions: string): Promise<Context> {
    return (await this.searchContexts(instructions))[0];
  }

  async execute(input: string, system = 'graphql'): Promise<string> {
    // inputの類似するspecsをredisから引っ張ってくる。
    const contexts = await this.searchContexts(input);
    return this._execute({
      input,
      system,
      specs: contexts.map(context => ({input: context.instructions, output: context.context})),
    });
  }

  async _execute({
    input,
    system,
    specs,
  }: {
    input: string;
    system: string,
    specs: {input: string, output: string}[],
  }): Promise<string> {
    const messages = [
      {role: 'system' as Role, content: system},
      ...specs.map(spec => [
        {role: 'user' as Role, content: spec.input},
        {role: 'assistant' as Role, content: spec.output},
      ]).flat(),
      {role: 'user' as Role, content: input},
    ];

    console.debug('messages:', messages);
    const output = await this.ai.chatComplete(messages);

    console.debug('flag2:');


    return output;
  }
}
