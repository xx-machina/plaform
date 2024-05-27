import { ChangeDetectionStrategy, Component, ContentChildren, ElementRef, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'frames-tabs',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
  ],
  template: `
    <mat-tab-group>
      <mat-tab *ngFor="let tab of tabs; let i = index" [label]="'Tab ' + (i + 1)">
        <ng-container *ngTemplateOutlet="tab.content"></ng-container>
      </mat-tab>
    </mat-tab-group>
  `,
  styleUrls: ['./tabs.frame.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsFrame {
  @ContentChildren('tab') tabContents: QueryList<ElementRef>;

  tabs: any[] = [];

  ngAfterContentInit() {
    this.tabContents.forEach((content, index) => {
      this.tabs.push({ content: content });
    });
  }
}
