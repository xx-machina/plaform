import { 
	Rule, Tree, SchematicContext, apply, chain,
	externalSchematic, schematic,
	url, applyTemplates, mergeWith, move, noop,
	template as _template,
	filter
} from '@angular-devkit/schematics';
import * as strings from '@angular-devkit/core/src/utils/strings';
import { parseName } from '@schematics/angular/utility/parse-name';
import { createDefaultPath } from '@schematics/angular/utility/workspace';
import { join } from 'path';
import { Schema } from './schema';
import { omit } from 'lodash';

export const atomicComponent = (options: Schema): Rule => async (host: Tree, _: SchematicContext) => {
	options.prefix ||= `${options.type}s`;
	options.path = join(await createDefaultPath(host, options.project), options?.path ?? '');

	const { name, path, type, project, standalone } = options = {...options, ...parseName(options.path, options.name)};
	const opt = omit(options, ['styleHeader', 'useTypeAsExtension', 'story', 'ngPackage']);
	const { styleHeader, useTypeAsExtension } = options;
	const componentExt = useTypeAsExtension ? type : 'component';
	const scssPath = `${path}/${name}/${name}.${componentExt}.scss`;

	return chain([
		options.standalone ? noop() : externalSchematic('@schematics/angular', 'module', {name, path, project}),
		externalSchematic('@schematics/angular', 'component', {...opt, type: componentExt, export: true}),
		mergeWith(apply(
			url('./files'),
			[
				applyTemplates({...strings, name, type: type ?? 'component', standalone}),
				move(path),
				filter(path => {
					if (path.endsWith('/index.ts')) return true;
					if (options.ngPackage && path.endsWith('/ng-package.json')) return true;
					if (options.story && path.endsWith('.stories.ts')) return true;
					return false
				}),
			],
		)), 
		schematic('style-header', {...options, styleHeader, name, type, path: scssPath}),
	]);
};

export const atom = (options: Schema): Rule => atomicComponent(({...options, type: 'atom'}));
export const molecule = (options: Schema): Rule => atomicComponent(({...options, type: 'molecule'}));
export const organism = (options: Schema): Rule => atomicComponent(({...options, type: 'organism'}));
export const template = (options: Schema): Rule => atomicComponent(({...options, type: 'template'}));
export const frame = (options: Schema): Rule => atomicComponent(({...options, type: 'frame'}));
export const sheet = (options: Schema): Rule => atomicComponent(({...options, type: 'sheet'}));
export const dialog = (options: Schema): Rule => atomicComponent(({...options, type: 'dialog'}));
