import { FileEntry } from "@angular-devkit/schematics";
import { Injectable } from '@angular/core';
import { injectOpenAiService } from '@nx-ddd/common/infrastructure/externals/openai';
import chalk from 'chalk';
import { DUMMY_FILE_ENTRY } from "../../dummy";
import { buildOutputEntry } from "../../instructor";
import { InputFileEntriesReducer } from "../../reducers";

const ReduceInputFileEntries = (size: number) => {
  return function (_0, _1, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      _inputFileEntries: FileEntry[], 
      instructions: string, 
      outputPaths: string[],
    ) {
      const reducer = new InputFileEntriesReducer();
      const inputFileEntries = reducer.reduce(_inputFileEntries, instructions, size);
      return originalMethod.apply(this, [inputFileEntries, instructions, outputPaths]);
    };

    return descriptor;
  }
}


@Injectable({providedIn: 'root'})
export class OutputFileEntryEstimator {
  protected openai = injectOpenAiService();
  protected config = {
    sample: 3,
  };

  async estimate(
    inputFileEntries: FileEntry[], 
    instructions: string,
    outputFilePath: string
  ): Promise<FileEntry> {
    if (inputFileEntries.length === 0) {
      inputFileEntries = [DUMMY_FILE_ENTRY];
    }
    const sampleInputFileEntries = inputFileEntries.slice(0, this.config.sample);

    console.log(
      `${chalk.blue(`ESTIMATING`)} ${outputFilePath} ${chalk.blue(`FROM`)}`,
      sampleInputFileEntries.map(entry => entry.path),
      `${chalk.blue(`BY`)}`,
      `"${chalk.yellow(instructions)}"`,
    );

    const output = await this.instruct(sampleInputFileEntries, instructions, [buildOutputEntry('', outputFilePath)]);
    return output.find(fileEntry => fileEntry.path === outputFilePath);
  }

  private async instruct(
    inputs: FileEntry[],
    instructions: string,
    outputs: FileEntry[],
    context: string = '',
  ): Promise<FileEntry[]> {
    if (!inputs.length) throw new Error('At least one input file is required!')

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
    const res = await this.openai.chat.completions.create({
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

  buildInstructions(path: string): string {
    return `Write a content of \`${path}\` like inputs:`;
  }
}
