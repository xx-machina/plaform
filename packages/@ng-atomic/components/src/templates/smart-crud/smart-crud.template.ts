import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollModule } from '@ng-atomic/components/frames/scroll';
import { AutoLayoutModule } from '@ng-atomic/components/frames/auto-layout';
import { HeaderModule } from '@ng-atomic/components/molecules/header';
import { ActionButtonsSectionModule } from '@ng-atomic/components/organisms/action-buttons-section';
import { NavigatorModule } from '@ng-atomic/components/organisms/navigator';
import { TextareaSectionModule } from '@ng-atomic/components/organisms/textarea-section';
import { TextInputSectionModule } from '@ng-atomic/components/organisms/text-input-section';
import { DateInputSectionModule } from '@ng-atomic/components/organisms/date-input-section';
import { SelectInputSectionModule } from '@ng-atomic/components/organisms/select-input-section';
import { SmartFieldModule } from '@ng-atomic/common/pipes/smart-field';
import { DomainModule } from '@ng-atomic/common/pipes/domain';
import { AbstractControl } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';
import { FormGroup } from '@ngneat/reactive-forms';

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/smart-crud] Back',
  CREATE = '[@ng-atomic/components/templates/smart-crud] Create',
  UPDATE = '[@ng-atomic/components/templates/smart-crud] Update',
  DELETE = '[@ng-atomic/components/templates/smart-crud] Delete',
}

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // Pipes
    DomainModule,
    SmartFieldModule,
    // Frames
    AutoLayoutModule,
    ScrollModule,
    // Organisms
    ActionButtonsSectionModule,
    NavigatorModule,
    DateInputSectionModule,
    TextInputSectionModule,
    TextareaSectionModule,
    SelectInputSectionModule,
    // Molecules
    HeaderModule,
  ],
  selector: 'templates-smart-crud',
  templateUrl: './smart-crud.template.html',
  styleUrls: ['./smart-crud.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'template'},
})
export class SmartCrudTemplate {

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
