import { Rule, schematic, SchematicContext, Tree } from '@angular-devkit/schematics';
import { BaseSchema } from '../base-schema';
import { instruct, InstructSchema } from '../instruct';
import { tryToCreateDefaultPath } from '../utils';
import { join } from 'path';

export interface DirectorySchema extends BaseSchema {
  path: string;
  name: string;
  scope: string;
  inputScope?: string;
  outputScope?: string;
  
  inputs?: string;
}

export class DirectorySchematicAdaptor {
  static options(options: DirectorySchema): InstructSchema {
    return {
      project: options.project,
      path: options.path,
      parallel: options.parallel,
      overwrite: options.overwrite,
      instructions: `Generate a directory \`${options.name}\`.`,
      scope: options.scope,
      inputScope: options.inputScope,
      outputScope: options.outputScope,
      inputs: options.inputs,
      outputs: undefined,
    };
  }
}

export function directory(options: DirectorySchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    return schematic('instruct', DirectorySchematicAdaptor.options(options));
  };
};
