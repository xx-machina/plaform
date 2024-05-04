import { Injectable } from "@nx-ddd/core";

@Injectable()
export abstract class BaseAdapter {
  abstract embedding(input: string, model?: string): Promise<number[]>;
  abstract complete(prompt: string, options: {
    model: string,
    max_tokens: number,
    stop: string,
  }): Promise<string>;
}
