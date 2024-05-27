import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

export function buildTreeFlatDataSource<T = any>(treeControl: FlatTreeControl<T>, data: T[], key = 'children') {
  const treeFlattener = new MatTreeFlattener(
    (node: any, level: number) => {
      node.level = level;
      node.isExpandable = (node[key] ?? []).length > 0;
      return node;
    },
    (node) => node.level,
    (node) => node.isExpandable,
    (node) => node[key]
  );
  
  return new MatTreeFlatDataSource(treeControl, treeFlattener, data);
}