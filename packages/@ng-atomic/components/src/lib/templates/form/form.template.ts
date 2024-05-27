import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, computed, inject, input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ScrollFrame } from '@ng-atomic/components/frames/scroll-v2';
import { AutoLayoutFrame } from '@ng-atomic/components/frames/auto-layout';
import { HeaderMoleculeStore } from '@ng-atomic/components/molecules/header';
import { ActionButtonsSectionOrganismStore } from '@ng-atomic/components/organisms/action-buttons-section';
import { NavigatorOrganismStore } from '@ng-atomic/components/organisms/navigator';
import { TextareaSectionOrganismStore } from '@ng-atomic/components/organisms/textarea-section';
import { TextInputSectionOrganismStore } from '@ng-atomic/components/organisms/text-input-section';
import { DateInputSectionOrganism } from '@ng-atomic/components/organisms/date-input-section';
import { SelectInputSectionOrganismStore } from '@ng-atomic/components/organisms/select-input-section';
import { FormFieldMap } from '@ng-atomic/common/pipes/smart-field';
import { DomainPipe } from '@ng-atomic/common/pipes/domain';
import { AbstractControl } from '@angular/forms';
import { Action, Effect, InjectableComponent, _computed } from '@ng-atomic/core';
import { ActionInputSectionOrganismStore } from '@ng-atomic/components/organisms/action-input-section';
import { NgAtomicComponent } from '@ng-atomic/core';
import { FileInputSectionOrganism, FileInputSectionOrganismStore } from '@ng-atomic/components/organisms/file-input-section';
import { AgreementInputSectionOrganism } from '@ng-atomic/components/organisms/agreement-input-section';
import { VideoSectionOrganism } from '@ng-atomic/components/organisms/video-section';
import { NavActionId, injectIsRootPage, injectNavStartActions, makeConfig } from '@ng-atomic/common/services/ui';
import { get } from 'lodash-es';
import { NumberInputSectionOrganismStore } from '@ng-atomic/components/organisms/number-input-section';
import { ImagePreviewSectionOrganism } from '@ng-atomic/components/organisms/image-preview-section';
import { PasswordInputSectionOrganismStore } from '@ng-atomic/components/organisms/password-input-section';
import { DateRangeInputSectionOrganism } from '@ng-atomic/components/organisms/date-range-input-section';

function walkControls(controls: any, cb: (name: string, control: any) => void, excludes: string[] = [], name = '') {
  Object.entries(controls).forEach(([key, control]: any) => {
    const path = name === '' ? key : `${name}.${key}`;
    if (excludes.includes(path)) {
      cb(path, control);
    } else if (control.controls) {
      walkControls(control.controls, cb, excludes, path);
    } else {
      cb(path, control);
    }
  });
}

function flatControls(form: FormGroup, excludes: string[]): [string, AbstractControl][] {
  const controlMap = new Map<string, AbstractControl>();
  walkControls(form?.controls, (name, control: AbstractControl) => controlMap.set(name, control), [
    ...excludes,
  ]);
  return [...controlMap.entries()];
}

export enum ActionId {
  BACK = '[@ng-atomic/components/templates/form] Back',
  CREATE = '[@ng-atomic/components/templates/form] Create',
  UPDATE = '[@ng-atomic/components/templates/form] Update',
  DELETE = '[@ng-atomic/components/templates/form] Delete',
  FILE_SELECTED = '[@ng-atomic/components/templates/form] File selected',
  CANCEL = '[@ng-atomic/components/templates/form] Cancel',
}

@Directive({ standalone: true })
export class FormTemplateStore extends InjectableComponent {
  static readonly Config = makeConfig(() => {
    const isRootPage = injectIsRootPage();
    const navStartActions = injectNavStartActions(isRootPage);
    return () => ({
      navStartActions: navStartActions(),
      navEndActions: [{id: ActionId.DELETE, name: '削除', icon: 'delete'}] as Action[],
      title: '',
      form: inject(FormBuilder).group({id: ['']}),
      formFlatExcludes: [] as string[],
      actions: [{id: ActionId.CREATE, name: '作成'}] as Action[],
      fieldMap: {
        createdAt: { type: 'date' },
        updatedAt: { type: 'date' },
        deletedAt: { type: 'date' },
      } as FormFieldMap,
    });
  }, ['components', 'templates', 'form']);
  readonly config = FormTemplateStore.Config.inject();
  readonly navStartActions = input(_computed(() => this.config().navStartActions));
  readonly navEndActions = input(_computed(() => this.config().navEndActions));
  readonly title = input(_computed(() => this.config().title));
  readonly form = input(_computed(() => this.config().form));
  readonly formFlatExcludes = input(_computed(() => this.config().formFlatExcludes));
  readonly actions = input(_computed(() => this.config().actions));
  readonly fieldMap = input(_computed(() => this.config().fieldMap));
  readonly controlEntries = computed(() => {
    return flatControls(this.form(), this.formFlatExcludes()).map(([name, control]) => ({
      name, control, field: get(this.fieldMap(), name) ?? {type: 'text'},
    }));
  });
}

@Component({
  standalone: true,
  imports: [
    DomainPipe,
    AgreementInputSectionOrganism,
    AutoLayoutFrame,
    ScrollFrame,
    ActionButtonsSectionOrganismStore,
    ActionInputSectionOrganismStore,
    FileInputSectionOrganismStore,
    NavigatorOrganismStore,
    DateInputSectionOrganism,
    DateRangeInputSectionOrganism,
    TextInputSectionOrganismStore,
    NumberInputSectionOrganismStore,
    TextareaSectionOrganismStore,
    SelectInputSectionOrganismStore,
    HeaderMoleculeStore,
    VideoSectionOrganism,
    ImagePreviewSectionOrganism,
    PasswordInputSectionOrganismStore,
  ],
  selector: 'templates-form',
  template: `
  <frames-scroll>
    <organisms-navigator injectable
      [startActions]="store.navStartActions()"
      [endActions]="store.navEndActions()"
      (action)="dispatch($event)"
      top
    >
      <molecules-header injectable [title]="store.title()" [description]="''"/>
    </organisms-navigator>
    <frames-auto-layout vertical>
      @for (entry of store.controlEntries(); track entry.name;) {
        @switch (entry.field.type) {
          @case ('select') {
            @defer {
              <organisms-select-input-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [hint]="entry.field.hint"
                [options]="entry.field.options"
                [placeholder]="entry.field.placeholder"
                [actions]="entry.field.actions"
                [multiple]="entry.field?.multiple"
                (action)="dispatch($event)"
              />
            }
          }
          @case ('date') {
            <!-- @defer { -->
              <organisms-date-input-section
                [label]="entry.name | domain"
                [hint]="entry.field.hint"
                [control]="entry.control"
                [actions]="entry.field.actions"
                (action)="dispatch($event)"
              />
            <!-- } -->
          }
          @case ('date-range') {
            <organisms-date-range-input-section
              [label]="entry.name | domain"
              [hint]="entry.field.hint"
              [control]="entry.control"
              [actions]="entry.field.actions"
              (action)="dispatch($event)"
            />
          }
          @case ('text') {
            @defer {
              <organisms-text-input-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [actions]="entry.field.actions"
                [hint]="entry.field.hint"
                [placeholder]="entry.field.placeholder"
                [autoComplete]="entry.field.autoComplete"
                (action)="dispatch($event)"
              />
            }
          }
          @case ('number') {
            @defer {
              <organisms-number-input-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [actions]="entry.field.actions"
                [hint]="entry.field.hint"
                [placeholder]="entry.field.placeholder"
                (action)="dispatch($event)"
              />
            }
          }
          @case ('textarea') {
            @defer {
              <organisms-textarea-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [hint]="entry.field.hint"
                [rows]="entry.field.rows"
                [placeholder]="entry.field.placeholder"
                (action)="dispatch($event)"
              />
            }
          }
          @case ('password') {
            @defer {
              <organisms-password-input-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [hint]="entry.field.hint"
                [placeholder]="entry.field.placeholder"
                [actions]="entry.field.actions"
                (action)="dispatch($event)"
              />
            }
          }
          @case ('action') {
            @defer {
              <organisms-action-input-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [hint]="entry.field.hint"
                [actions]="entry.field.actions"
                (action)="dispatch($event)"
              />
            }
          }
          @case ('file') {
            @defer {
              <organisms-file-input-section injectable
                [label]="entry.name | domain"
                [control]="entry.control"
                [hint]="entry.field.hint"
                [progress]="entry.field?.progress"
                (action)="dispatchFileInputAction($event, entry.name)"
              />
            }
          }
          @case ('agreement') {
            @defer {
              <organisms-agreement-input-section injectable
                [control]="entry.control"
                [labelTemp]="entry.field?.labelTemp"
              />
            }
          }
          @case ('preview') {
            @defer {
              <organisms-video-section injectable
                [src]="entry.control.value"
                [autoplay]="false"
              />
            }
          }
          @case ('preview:image') {
            @defer {
              <organisms-image-preview-section
                [src]="entry.control.value"
              />
            }
          }
          @case ('hidden') { }
        }
      }
      <organisms-action-buttons-section injectable
        [actions]="store.actions()"
        (action)="dispatch($event)"
      />
    </frames-auto-layout>
  </frames-scroll>
  `,
  styleUrls: ['./form.template.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: FormTemplateStore,
      inputs: [
        'navStartActions',
        'navEndActions',
        'title',
        'form',
        'formFlatExcludes',
        'actions',
        'fieldMap',
      ],
    },
  ],
  host: {class: 'template'}
})
export class FormTemplate extends NgAtomicComponent {
  static ActionId = ActionId;
  protected readonly store = inject(FormTemplateStore);
  protected readonly cd = inject(ChangeDetectorRef);

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

  ngOnInit(): void {
    this.store.form().statusChanges.subscribe(() => this.cd.markForCheck());
  }

  @Effect(NavActionId.BACK)
  protected back() {
    this.dispatch({id: ActionId.BACK});
  }
}
