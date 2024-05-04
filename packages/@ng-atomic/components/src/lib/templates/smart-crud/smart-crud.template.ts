import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { HeaderMolecule } from '@ng-atomic/components/molecules/header';
import { ActionButtonsSectionOrganism } from '@ng-atomic/components/organisms/action-buttons-section';
import { NavigatorOrganism } from '@ng-atomic/components/organisms/navigator';
import { TextareaSectionOrganism } from '@ng-atomic/components/organisms/textarea-section';
import { TextInputSectionOrganism } from '@ng-atomic/components/organisms/text-input-section';
import { DateInputSectionOrganism } from '@ng-atomic/components/organisms/date-input-section';
import { SelectInputSectionOrganism } from '@ng-atomic/components/organisms/select-input-section';
import { SmartFieldPipe } from '@ng-atomic/common/pipes/smart-field';
import { DomainPipe } from '@ng-atomic/common/pipes/domain';
import { AbstractControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';
import { FormGroup } from '@angular/forms';
import { ActionInputSectionOrganism } from '@ng-atomic/components/organisms/action-input-section';
import { NgAtomicComponent } from '@ng-atomic/common/stores/component-store';
import { FileInputSectionOrganism } from '@ng-atomic/components/organisms/file-input-section';
import { SignalPipe } from '@ng-atomic/common/pipes/signal';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/smart-crud] Back',
  CREATE = '[@ng-atomic/components/templates/smart-crud] Create',
  UPDATE = '[@ng-atomic/components/templates/smart-crud] Update',
  DELETE = '[@ng-atomic/components/templates/smart-crud] Delete',
  FILE_SELECTED = '[@ng-atomic/components/templates/smart-crud] File selected',
  CANCEL = '[@ng-atomic/components/templates/smart-crud] Cancel',
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DomainPipe,
    SmartFieldPipe,
    AutoLayoutFrame,
    ScrollFrame,
    ActionButtonsSectionOrganism,
    ActionInputSectionOrganism,
    FileInputSectionOrganism,
    NavigatorOrganism,
    DateInputSectionOrganism,
    TextInputSectionOrganism,
    TextareaSectionOrganism,
    SelectInputSectionOrganism,
    HeaderMolecule,
    SignalPipe,
  ],
  selector: 'templates-smart-crud',
  template: `
  <frames-scroll>
    <organisms-navigator 
      [startActions]="navStartActions"
      [endActions]="navEndActions"
      (action)="action.emit($event)"
      navigator
    >
      <molecules-header [title]="title"></molecules-header>
    </organisms-navigator>
    <frames-auto-layout vertical contents>
      <ng-container *ngFor="let entry of controls; trackBy:trackByIndex" [ngSwitch]="(entry[0] | smartField)?.type">
        <organisms-select-input-section
          *ngSwitchCase="'select'"
          [label]="entry[0] | domain"
          [control]="entry[1]"
          [hint]="(entry[0] | smartField)?.hint"
          [options]="(entry[0] | smartField)?.options"
          [placeholder]="(entry[0] | smartField)?.placeholder"
        ></organisms-select-input-section>
        <organisms-date-input-section
          *ngSwitchCase="'date'"
          [label]="entry[0] | domain"
          [hint]="(entry[0] | smartField)?.hint"
          [control]="entry[1]"
        ></organisms-date-input-section>
        <organisms-text-input-section
          *ngSwitchCase="'number'"
          [type]="'number'"
          [hint]="(entry[0] | smartField)?.hint"
          [label]="entry[0] | domain"
          [control]="entry[1]"
        ></organisms-text-input-section>
        <organisms-textarea-section
          *ngSwitchCase="'textarea'"
          [label]="entry[0] | domain"
          [control]="entry[1]"
          [hint]="(entry[0] | smartField)?.hint"
          [rows]="(entry[0] | smartField).rows"
          [placeholder]="(entry[0] | smartField)?.placeholder"
        ></organisms-textarea-section>
        <organisms-action-input-section
          *ngSwitchCase="'action'"
          [label]="entry[0] | domain"
          [control]="entry[1]"
          [hint]="(entry[0] | smartField)?.hint"
          [actions]="(entry[0] | smartField).actions | signal"
          (action)="dispatch($event)"
        ></organisms-action-input-section>
        <organisms-file-input-section
          *ngSwitchCase="'file'"
          [label]="entry[0] | domain"
          [control]="entry[1]"
          [hint]="(entry[0] | smartField)?.hint | signal"
          [progress]="(entry[0] | smartField)?.progress | signal"
          (action)="dispatchFileInputAction($event, entry[0])"
        ></organisms-file-input-section>
        <div *ngSwitchCase="'preview'">
          <video controls width="100%" [src]="entry[1].value"></video>
        </div>
        <ng-container *ngSwitchCase="'none'"></ng-container>
        <organisms-text-input-section
          *ngSwitchDefault
          [label]="entry[0] | domain"
          [control]="entry[1]"
          [hint]="(entry[0] | smartField)?.hint"
          [placeholder]="(entry[0] | smartField)?.placeholder"
          [autoComplete]="(entry[0] | smartField)?.autoComplete"
        ></organisms-text-input-section>
      </ng-container>
      <organisms-action-buttons-section
        [actions]="actions"
        (action)="action.emit($event)"
      ></organisms-action-buttons-section>
    </frames-auto-layout>
  </frames-scroll>
  `,
  styleUrls: ['./smart-crud.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'template'},
})
export class SmartCrudTemplate extends NgAtomicComponent {
  static ActionId = ActionId;

  @Input()
  title: string = '';

  @Input()
  form!: FormGroup<any>;

  @Input()
  navStartActions: Action[] = [{ id: ActionId.BACK, icon: 'arrow_back' }];

  @Input()
  navEndActions: Action[] = [{id: ActionId.DELETE, name: '削除'}];

  @Input()
  actions: Action[] = [{id: ActionId.CREATE, name: '作成'}];

  @Output()
  action = new EventEmitter<Action>();

  get controls() {  
    const controlMap = new Map<string, AbstractControl>();
    walkControls(this.form.controls, (name, control: any) => controlMap.set(name, control));
    return [...controlMap.entries()];
  }

  trackByIndex = (index: number) => index;

  protected dispatchFileInputAction(action: Action, name: string) {
    switch (action.id) {
      case FileInputSectionOrganism.ActionId.FILE_SELECTED: {
        return this.dispatch({id: ActionId.FILE_SELECTED, payload: {scope: name, files: action.payload}});
      }
      case FileInputSectionOrganism.ActionId.CANCEL: {
        return this.dispatch({id: ActionId.CANCEL, payload: {scope: name}});
      }
    }
  }
}

function walkControls(
  controls: any,
  cb: (name: string, control: any) => void,
  name = ''
) {
  Object.entries(controls).forEach(([key, control]: any) => {
    const path = name === '' ? key : `${name}.${key}`;
    if (control.controls) {
      walkControls(control.controls, cb, path);
    } else {
      cb(path, control);
    }
  });
}
