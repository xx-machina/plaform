import { createDefaultPath } from '@schematics/angular/utility/workspace';
import { FileEntry, Rule, Tree } from "@angular-devkit/schematics";
import { join } from "path";
import { getFiles } from '../core/helpers/utils';
import { omit } from 'lodash-es';

const isAncestor = (dir: string, path: string) => dir.split('/').every((p, i) => p === path.split('/')[i]);

export function patchJson(fileEntry: FileEntry): FileEntry {
  const projects = Object.entries(JSON.parse(fileEntry.content.toString()).projects ?? []).reduce((obj, [name, project]) => ({
    ...obj,
    [name]: omit(project as object, ['$schema', 'tags', 'implicitDependencies']),
  }), {});
  const content = Buffer.from(JSON.stringify({ ...JSON.parse(fileEntry.content.toString()), projects }, null, 2));
  return {
    ...fileEntry,
    content,
  };
}

export function getFilePaths(tree: Tree, path: string = '/', inputs?: string): string[] {
  const dir = tree.getDir(path);
  let filePaths = getFiles(dir).map(p => join(path, p));

  if (inputs) {
    const dirArr = inputs.split(',').map(input => join(path, input));
    filePaths = filePaths.filter(path => dirArr.some(dir => isAncestor(dir, path)));
  }
  return filePaths;
}

export async function tryToCreateDefaultPath(tree: Tree, project: string, fallback = '/'): Promise<string> {


  // TreeのgetをProxyでラップしているため、tree.get('/angular.json')の結果を変える
  const _tree = new Proxy(tree, {
    get(target, prop, receiver) {
      if (prop === 'get') {
        return (path: string) => {
          if (path === '/angular.json') {
            const fileEntry = target.get(path);
            return patchJson(fileEntry)
          }
          return target.get(path);
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });

  return createDefaultPath(_tree, project).catch(() => fallback);
}

export function updateTree(entries: FileEntry[], overwrite = false): Rule {
  return (tree) => entries.forEach(entry => {
    if (!tree.exists(entry.path)) {
      tree.create(entry.path, entry.content);
    } else {
      if (overwrite) {
        tree.overwrite(entry.path, entry.content);
      } else {
        console.warn(`Cancelled to overwrite \`${entry.path}\`. If you want to overwrite, set \`--overwrite\` option.`);
      }
    }
  });
}
