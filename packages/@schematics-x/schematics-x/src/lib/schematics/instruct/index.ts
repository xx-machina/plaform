import { Rule, Tree } from '@angular-devkit/schematics';
import { bootstrap } from '@nx-ddd/core';
import { provideOpenaiService } from '@nx-ddd/common/infrastructure/externals/openai';
import { join } from 'path';
import { SchematicsX } from '../../core/schematics-x';
import { BaseSchema } from '../base-schema';
import { tryToCreateDefaultPath, updateTree } from '../utils';

export interface InstructSchema extends BaseSchema {
  instructions: string;

  scope: string;
  inputScope?: string;
  outputScope?: string;

  targets?: string;
  inputs?: string;
  outputs?: string;
}

export const instruct = (options: InstructSchema): Rule => async (tree: Tree) => {
  if (!process.env.OPENAI_API_KEY?.length) {
    throw new Error('OPENAI_API_KEY is not provided! Please `export OPENAI_API_KEY=<-OPENAI_API_KEY->`');
  }
	const projectDefaultPath = await tryToCreateDefaultPath(tree, options.project);
  const path = options.path ?? '.';
  const injector = await bootstrap([
    provideOpenaiService(() => ({ apiKey: process.env.OPENAI_API_KEY })),
  ]);
  const schematicsX = injector.get(SchematicsX);
  const entries = await schematicsX.execute(tree, {
    inputScope: join(projectDefaultPath, path, options.inputScope ?? options.scope),
    outputScope: join(projectDefaultPath, path, options.outputScope ?? options.scope),
    instructions: options.instructions,
    inputFilePaths: (options.inputs ?? options.targets)?.split(',')
      .map(filePath => join(projectDefaultPath, path, filePath)),
    outputFilePaths: (options.outputs ?? options.targets)?.split(',')
      .map(filePath => join(projectDefaultPath, path, filePath)),
    parallel: options.parallel,
  });
	return updateTree(entries, !!options.targets || options.overwrite);
};
