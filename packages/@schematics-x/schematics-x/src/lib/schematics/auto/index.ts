import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { hasExt } from '../../core/helpers/utils';
import { BaseSchema } from '../base-schema';
import { directory } from '../directory';
import { file } from '../file';

export interface AutoSchema extends BaseSchema {
  path: string;
  name: string;

  scope: string;
  inputScope?: string;
  outputScope?: string;
  inputs?: string;
  outputs?: string;
}

export const auto = (options: AutoSchema): Rule => (tree: Tree, context: SchematicContext) => {
  if (hasExt(options.name)) {
    return file(options)(tree, context);
  } else {
    return directory(options)(tree, context);
  }
};
