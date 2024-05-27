import { Injectable } from '@angular/core';
import { FilePathsReducer } from '../../reducers';
import { injectAnyFunction } from '@nx-ddd/common/infrastructure/externals/agent';
import { IsArray } from 'class-validator';

const ReduceInputsFilePaths = (size: number) => {
  return function (_0, _1, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (
      _inputFilePaths: string[], 
      instructions: string, 
      context: string = '',
    ) {
      const reducer = new FilePathsReducer();
      const inputFilePaths = reducer.reduce(_inputFilePaths, size);
      return originalMethod.apply(this, [inputFilePaths, instructions, context]);
    }
    
    return descriptor;
  }
};

export class FilePathResult {
  @IsArray() paths: string[];
}

@Injectable({providedIn: 'root'})
export class OutputFilePathsEstimator {
  protected anyFunciton = injectAnyFunction();

  // @ReduceInputsFilePaths(50)
  async estimate(inputFilePaths: string[], instructions: string): Promise<string[]> {
    const filePaths = inputFilePaths;
    const result = await this.anyFunciton.call({
      instructions,
      filePaths,
    }, FilePathResult, {
      instructions: `
      アシスタントはユーザーの入力した現状のファイルパスの配列を基に、下記の指示を満たすために出力すべきファイルのパスの配列を推定して返答してください。
      ディレクトリを生成する場合は内部のファイルパスを似通ったパスのディレクトリに似せて複数含めてください。
      `,
      specs: [
        {
          input: {
            instructions: "Generate a directory `/projects/common/src/lib/infrastructure/converters/test`.",
            paths: [
              '/projects/common/src/lib/infrastructure/converters/scholarship/index.ts',
              '/projects/common/src/lib/infrastructure/converters/scholarship/scholarship.converter.ts',
            ]
          },
          output: {
            paths: [
              '/projects/common/src/lib/infrastructure/converters/test/index.ts',
              '/projects/common/src/lib/infrastructure/converters/test/test.converter.ts',
            ]
          }
        }
      ]
    });
    return result.paths;
  }
}
