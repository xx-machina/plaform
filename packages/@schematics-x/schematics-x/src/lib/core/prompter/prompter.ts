import { FileEntry } from "@angular-devkit/schematics";
import { OpenAI } from "openai";
import { AxiosError } from 'axios';
import { PromiseQueue } from "../promise-queue";
import { logger } from "../../cli/logger";

export interface WriteOptions {
  model?: string,
  temperature?: number,
  maxTokens?: number,
}

function isAxiosError(err: Error): err is AxiosError {
  return !!(err as any)?.isAxiosError;
}

export class OpenAiPrompter {
  protected _prompt: string = '';

  constructor(
    protected promiseQueue: PromiseQueue,
    private token: string = process.env['OPENAI_API_KEY'],
  ) {
    if (!this.token?.length)
      throw new Error('OPENAI_API_KEY is not provided! Please `export OPENAI_API_KEY=<-OPENAI_API_KEY->`');
  }
  readonly openai = new OpenAI({apiKey: this.token});
  protected stop = '\n\`\`\`';

  get prompt(): string {
    return this._prompt;
  }

  async autoWrite(options?: WriteOptions) {
    const res = await this.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'user', content: this.prompt },
      ],
    });
    console.debug('res.choices.at(0).message.content:', res.choices.at(0).message.content);
    return res.choices.at(0).message.content;
  }

  async autoWriteUntilEnd(options?: WriteOptions, maxRepeat: number = 3) {
    for (let i = 0; i < maxRepeat; i++) {
      if(this.isEnd()) return;
      await this.autoWrite(options);
    }
  }

  async write(text: string) {
    this._prompt += text;
  }

  isEnd() {
    return this._prompt.endsWith(this.stop);
  }

  getFileEntries(): FileEntry[] {
    return this._prompt.split('```').filter((_, i) => i % 2).map(code => {
      const [path, ...lines] = code.split('\n');
      return {path, content: Buffer.from(lines.join('\n').slice(0, -1))} as FileEntry;
    });
  }

  getFileEntry(path: string): FileEntry | null {
    const entries = this.getFileEntries();
    return entries.find(file => file.path === path) ?? null;
  }
}
