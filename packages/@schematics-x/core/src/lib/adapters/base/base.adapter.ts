import { Injectable } from "@nx-ddd/core";

// export type Role = 'system' | 'user' | 'assistant';

export enum Role {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
}

@Injectable()
export abstract class BaseAdapter {
  abstract embedding(input: string, model?: string): Promise<number[]>;
  abstract complete(prompt: string, options: {
    model: string,
    max_tokens: number,
    stop: string,
  }): Promise<string>;
  abstract chatComplete(messages: {role: Role, content: string}[]): Promise<string>;
}
