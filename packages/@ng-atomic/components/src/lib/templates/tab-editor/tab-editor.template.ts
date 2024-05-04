import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeEditorTemplate } from '@ng-atomic/components/templates/code-editor';
import { ToolbarOrganism } from '@ng-atomic/components/organisms/toolbar';
import { NgAtomicComponent } from '@ng-atomic/core';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'templates-tab-editor',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarOrganism,
    CodeEditorTemplate,
    MatTabsModule,
  ],
  template: `
      <!-- <organisms-toolbar
        [form]="store.form"
        [actions]="store.actions"
        [endActions]="endActions"
        (action)="dispatch($event)"
      ></organisms-toolbar> -->
      <mat-tab-group #tabGroup>
        <mat-tab [label]="file.name" *ngFor="let file of files;trackBy: trackByHash" >
          <ng-container [ngSwitch]="file.type">
            <templates-image-editor
              *ngSwitchCase="'image/png'"
              [file]="file"
              (action)="dispatch($event)"
            ></templates-image-editor>
            <templates-code-editor
              *ngSwitchDefault
              [file]="file"
              (action)="dispatch($event)"
            ></templates-code-editor>
          </ng-container>
        </mat-tab>
      </mat-tab-group>
  `,
  styleUrls: ['./tab-editor.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabEditorTemplate extends NgAtomicComponent {
  protected trackByHash = (file: File) => `${file.name}-${file.lastModified}`;

  @Input()
  files: File[] = [];

}
