import { strings } from '@angular-devkit/core';
import { Rule, Tree, apply, applyTemplates, chain, externalSchematic, mergeWith, move, schematic, url } from '@angular-devkit/schematics';
import { parseName } from '@schematics/angular/utility/parse-name';
import { dasherize, classify } from '@angular-devkit/core/src/utils/strings';
import { createDefaultPath } from '@schematics/angular/utility/workspace';
import { omit } from 'lodash';
import { Schema } from '../atomic-component/schema';
import { addPathToRoutes } from '../_utilities';

type TargetType = 'page' | 'pages';
type Target = {path: string, name: string};

export const page = (options: Schema): Rule => async (host: Tree) => {
	options.type = 'page';
	options.name = resolveName(options.name);

	options.prefix ||= `${options.type}s`;
	options.path ??= await createDefaultPath(host, options.project);

	const { name, path, type, project } = options = {...options, ...parseName(options.path, options.name)};
	const { styleHeader, useTypeAsExtension } = options;
	const opt = omit(options, ['styleHeader', 'useTypeAsExtension', 'story', 'ngPackage']);

	const componentExt = useTypeAsExtension ? type : 'component';
	const scssPath = `${path}/${name}/${name}.${componentExt}.scss`;
	const pages = getPagesOptions(`${path}/${name}`);

	return chain([
		schematic('pages', {...pages, project}),
		addRouteIntoPagesRoutes(options, pages),
		generateRoutes({name, path, project, type}),
		externalSchematic('@schematics/angular', 'component', {...opt, changeDetection: 'Default', export: true}),
		schematic('style-header', {...options, styleHeader, name, type, path: scssPath}),
		addRouteIntoPageRoutes(options, {path, name}),
	]);
};

const generateRoutes = (options) => {
	return mergeWith(apply(url('./files'), [applyTemplates({...strings, ...options}), move(options.path)]));
}

const getPagesOptions = (fullPath: string): {path: string, name: string} => {
	const [_, name, ...paths] = fullPath.split('/').reverse();
	return {name, path: paths.reverse().join('/')};
};

const resolveName = (name: string) => {
	return 'pages/' + name.split('/').filter(path => path !== 'pages').join('/pages/');
};

const addRouteIntoPagesRoutes = (options: Schema, target: Target) => {
	const routeOptions = buildOption(options, target, 'pages');
	return addPathToRoutes(routeOptions);
};

const addRouteIntoPageRoutes = (options: Schema, target: Target) => {
	const routeOptions = buildOption(options, target, 'page');
	return addPathToRoutes(routeOptions);
};

const buildOption = (options, {path, name}: Target, type: TargetType) => {
	console.debug(`${path}/${name}/${name}.routes.ts`);
	return {
		...options,
		routesPath: `${path}/${name}/${name}.routes.ts`,
		route: type === 'pages' ? buildPagesRoute(options.name) : buildPageRoute(name),
		removeOtherRoutes: type === 'page',
	}
};

const buildPagesRoute = (name): string => `
	{
		path: '${name}',
		loadChildren: () => import('./${dasherize(name)}/${dasherize(name)}.routes').then(m => m.routes)
	}`;

const buildPageRoute = (name): string => `
	{
		path: '',
		component: ${classify(name)}Page,
		loadChildren: () => import('@ng-atomic/components/pages/blank').then(m => m.routes)
		// loadChildren: () => import('./pages/pages.routes').then(m => m.routes)
	}`;
