import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTreeFlatDataSource, MatTreeFlattener, MatTreeModule } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import * as gql from 'gql-query-builder';
import { Action } from '@ng-atomic/core';
import { parse, print } from 'graphql';

function format(query: string): string {
  return print(parse(query));
}

export class Node {
  children: Node[];
  item: string;
  value?: boolean | string;
}

export class FlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

export enum ActionId {
  CHANGE_QUERY = '[@ng-atomic/components/organisms/tree-section] Change Query',
}

@Component({
  selector: 'organisms-tree-section',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  template: `
  <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle matTreeNodePadding>
      <mat-checkbox
        class="checklist-leaf-node"
        [checked]="selection.isSelected(node)"
        (change)="todoLeafItemSelectionToggle(node)"
      >{{ node.item }} (a)</mat-checkbox>
    </mat-tree-node>
    <mat-tree-node *matTreeNodeDef="let node; when: hasChild" matTreeNodePadding>
      <mat-checkbox
        [checked]="descendantsAllSelected(node)"
        [indeterminate]="descendantsPartiallySelected(node)"
        (change)="nodeSelectionToggle(node)"
      >{{ node.item }} (b)</mat-checkbox>
    </mat-tree-node>
  </mat-tree>
  `,
  styleUrls: ['./tree-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeSectionOrganism {
  flatNodeMap = new Map<FlatNode, Node>();
  nestedNodeMap = new Map<Node, FlatNode>();
  getLevel = (node: FlatNode) => node.level;
  isExpandable = (node: FlatNode) => node.expandable;
  treeControl = new FlatTreeControl<FlatNode>(this.getLevel, this.isExpandable);
  hasChild = (_: number, _nodeData: FlatNode) => _nodeData.expandable;
  getChildren = (node: Node): Node[] => node.children;
  transformer = (node: Node, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode =
      existingNode && existingNode.item === node.item ? existingNode : new FlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children?.length;

    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  };
  treeFlattener = new MatTreeFlattener(
    this.transformer,
    this.getLevel,
    this.isExpandable,
    this.getChildren,
  );
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  selection = new SelectionModel<FlatNode>(true);

  buildNode(obj: {[key: string]: any}, level: number): Node[] {
    return Object.keys(obj).reduce<Node[]>((accumulator, key) => {
      const value = obj[key];
      const node = new Node();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildNode(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  buildValueNode(nodes: Node[]): Node[] {
    return (nodes ?? []).map(node => {
      const flatNode = this.nestedNodeMap.get(node);
      node.value = this.selection.isSelected(flatNode);
      node.children = this.buildValueNode(node.children);
      return node;
    });
  }

  buildFields(nodes: Node[]): (string | object)[] {
    return nodes.reduce((acc, node) => {
      if(node.value) {
        if (node?.children?.length) {
          return [...acc, {[node.item]: this.buildFields(node.children)}];
        } else {
          return [...acc, node.item];
        }
      } else {
        return [...acc];
      }
    }, []);
  }

  onChange() {
    console.debug('this.dataSource.data:', this.dataSource.data);
    const nodes = this.buildValueNode(this.dataSource.data ?? []);
    console.debug('nodes:', nodes);

    const fields = this.buildFields(nodes);
    console.debug('fields:', fields);
    const options = fields.map(field => ({
      operation: Object.keys(field)[0],
      fields: Object.values(field)[0],
      variables: {
        take: {
          value: 10,
          required: false,
        },
      },
    }))

    const query = gql.query(options);

    console.debug('parsed:', parse(query.query));

    this.action.emit({
      id: ActionId.CHANGE_QUERY,
      payload: {query: format(query.query), variables: query.variables},
    });
    console.debug('query:', format(query.query));
  }

  @Input()
  data: any = {};

  @Output()
  action = new EventEmitter<Action>();

  ngOnInit() {
  //   const TREE_DATA = {
  //   Groceries: {
  //     'Almond Meal flour': null,
  //     'Organic eggs': null,
  //     'Protein Powder': null,
  //     Fruits: {
  //       Apple: null,
  //       Berries: ['Blueberry', 'Raspberry'],
  //       Orange: null,
  //     },
  //   },
  //   Reminders: [
  //     'Cook dinner',
  //     'Read the Material Design spec',
  //     'Upgrade Application to Angular',
  //     {
  //       etst: ['test'],
  //     }
  //   ],
  // };
    this.dataSource.data = this.buildNode(this.data, 0);
  }

  todoLeafItemSelectionToggle(node) {
    console.debug('todoItemSelectionToggle', node);
    if (this.selection.isSelected(node)) {
      this.selection.deselect(node);
      this.treeControl.collapse(node);
    } else {
      this.selection.select(node);
      this.treeControl.expand(node);
    }
    this.onChange();

  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected =
      descendants.length > 0 &&
      descendants.every(child => {
        return this.selection.isSelected(child);
      });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: FlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.selection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  nodeSelectionToggle(node: FlatNode) {
    console.debug('todoItemSelectionToggle', this.selection.isSelected(node));
    if (this.selection.isSelected(node)) {
      this.selection.deselect(node);
      this.treeControl.collapse(node);
    } else {
      this.selection.select(node);
      this.treeControl.expand(node);
    }
    console.debug('todoItemSelectionToggle', node);
    this.onChange();
  }
}

