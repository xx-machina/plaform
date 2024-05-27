import { FileEntry } from "@angular-devkit/schematics";
import { inject, Injectable } from "@angular/core";
import { PromiseQueue } from "../promise-queue";
import { OpenAiPrompter, WriteOptions } from "../prompter";


@Injectable({providedIn: 'root'})
export class Instructor {
  protected promiseQueue = inject(PromiseQueue);

  async instruct(
    inputs: FileEntry[],
    instructions: string,
    outputs: FileEntry[],
    context: string = '',
    options?: WriteOptions
  ): Promise<FileEntry[]> {
    if (!inputs.length) throw new Error('At least one input file is required!')

    const prompter = new OpenAiPrompter(this.promiseQueue);
    const messages = [
      {
        role: 'system' as const,
        content: `
          AssistantはUserの入力したファイルパスに対して、Instructionsを満たすコードをExampleCodesをもとに生成して返してください。
          assisstantはコードブロック(\`\`\`)を含めないで生成ファイルのコンテンツのみを返答してください。

          ## Instructions
          ${instructions}
          
          ## Example Codes
          ${inputs.map(input => {
            return `\`\`\`${input.path}
            ${input.content.toString()}
            \`\`\``
          }).join('\n\n')}
        `,
      },
      {
        role: 'user' as const,
        content: outputs.at(0).path,
      }
    ];

    console.debug('messages:', messages);

    const res = await prompter.openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
    });

    const content = res.choices.at(0).message.content;

    return [
      {
        path: outputs[0].path,
        content: Buffer.from(content),
      },
    ];
  }
}

export function buildInputJson(obj: object, path = 'input.json'): FileEntry {
  return {
    path: path as any,
    content: Buffer.from(JSON.stringify(obj, null, 2)),
  }
}

export function buildOutputEntry(content: string, path = 'output.json'): FileEntry {
  return { path: path as any, content: Buffer.from(content) };
}