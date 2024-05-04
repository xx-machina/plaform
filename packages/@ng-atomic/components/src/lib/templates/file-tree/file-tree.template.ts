import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSystemTree } from '@webcontainer/api';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import {MatTreeModule} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgAtomicComponent } from '@ng-atomic/core';

export interface TreeNode {
  name: string;
  type: string;
  parent?: TreeNode
  children: TreeNode[];
}

enum ActionId {
  OPEN_FILE = '[@ng-atomic/components/templates/file-tree] Open File',
}

@Component({
  selector: 'templates-file-tree',
  standalone: true,
  imports: [
    CommonModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
  <mat-tree [dataSource]="dataSource" [treeControl]="treeControl" class="example-tree">
    <mat-tree-node *matTreeNodeDef="let node" matTreeNodeToggle>
      <a style="color: red" (click)="test(node)">1. {{ node.name }}</a>
    </mat-tree-node>
    <mat-nested-tree-node *matTreeNodeDef="let node; when: hasChild">
        <div class="mat-tree-node">
          <button
            mat-icon-button
            matTreeNodeToggle
            [attr.aria-label]="'Toggle ' + node.name"
          >
            <mat-icon class="mat-icon-rtl-mirror">
              {{treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'}}
            </mat-icon>
          </button>
          <span>{{ node.name }}</span>
        </div>
        <div [class.example-tree-invisible]="!treeControl.isExpanded(node)"
            role="group">
          <ng-container matTreeNodeOutlet></ng-container>
      </div>
    </mat-nested-tree-node>
  </mat-tree>
  `,
  styleUrls: ['./file-tree.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileTreeTemplate extends NgAtomicComponent {
  static ActionId = ActionId;

  @Input()
  set treeNode(treeNode: TreeNode[]) {
    this.dataSource.data = treeNode;
  }

  treeControl = new NestedTreeControl<TreeNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<TreeNode>();

  protected test(node: TreeNode) {
    console.debug('test');
    this.dispatch({id: ActionId.OPEN_FILE, payload: node});
  }

  hasChild = (_: number, node: TreeNode) => !!node.children && node.children.length > 0;
}
