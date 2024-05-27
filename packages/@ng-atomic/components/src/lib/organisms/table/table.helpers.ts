import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';

export function buildTreeFlatDataSource<T = any>(data: T[], key = 'children') {
  const treeControl = new FlatTreeControl<any>(
    (node) => node.level,
    (node) => node.isExpandable
  );
  const treeFlattener = new MatTreeFlattener(
    (node: any, level: number) => ({
      ...node,
      isExpandable: (node[key] ?? []).length > 0,
      level,
    }),
    (node) => node.level,
    (node) => node.isExpandable,
    (node) => node[key]
  );
  
  return new MatTreeFlatDataSource(treeControl, treeFlattener, data);
}