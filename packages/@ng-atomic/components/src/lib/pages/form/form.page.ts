import { Component, Directive, InjectionToken, computed, effect, inject, input, signal } from '@angular/core';
import { RouterOutletFrame } from '@ng-atomic/components/frames/router-outlet';
import { FormTemplate } from '@ng-atomic/components/templates/form';
import { Effect, EffectReducer, InjectableComponent, NgAtomicComponent, _computed } from '@ng-atomic/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { injectOne } from '@ng-atomic/common/stores/entities';
import { LoadingService } from '@ng-atomic/common/services/loading';
import { injectModel, injectModelName } from '@ng-atomic/common/pipes/domain';
import { SnackBarService } from '@ng-atomic/common/services/snack-bar';
import { injectIsRootPage, injectNavStartActions, makeConfig } from '@ng-atomic/common/services/ui';
import { injectRouteParam, injectRouteParams } from '@ng-atomic/common/utils';
import { FormFieldMap } from '@ng-atomic/common/pipes/smart-field';
import { camelCase } from 'lodash-es';
import { computedAsync } from 'ngxtension/computed-async';
import { map, startWith } from 'rxjs';

enum ActionId {
  BACK = '[@ng-atomic/components/pages/form] Back',
  CREATE = '[@ng-atomic/components/pages/form] Create',
  UPDATE = '[@ng-atomic/components/pages/form] Update',
  FILE_SELECTED = '[@ng-atomic/components/pages/form] File Selected',
}

export const ENTITY_ID_NAME = new InjectionToken<string>('[@ng-atomic/components/pages/form] EntityIdName');

export function provideEntityIdName(name: string) {
  return {provide: ENTITY_ID_NAME, useValue: name};
}

export function injectEntityIdName() {
  return inject(ENTITY_ID_NAME, {optional: true}) ?? `${(camelCase(injectModelName()()))}Id`;
}

@Directive({
  standalone: true,
  selector: 'form-page-store',
  providers: [
    EffectReducer,
  ],
})
export class FormPageStore extends InjectableComponent {
  static readonly ActionId = ActionId;
  static readonly Config = makeConfig(() => {
    const modelName = injectModelName();
    const entityId = injectRouteParam(injectEntityIdName());
    const entity = injectModel() ? injectOne(injectModel(), {id: entityId}) : signal(null);
    const isRootPage = injectIsRootPage();
    const navStartActions = injectNavStartActions(isRootPage);
    const fb = inject(FormBuilder);
    const mode = computed(() => entityId() === 'new' ? 'create' : 'update');
    return () => ({
      form: fb.group({
        id: [],
        name: [],
      }) as AbstractControl,
      formFlatExcludes: [] as string[],
      entityId: entityId(),
      entity: entity(),
      mode: mode(),
      navStartActions: navStartActions(),
      navEndActions: [],
      title: mode() === 'create' ? `${modelName()}の作成` : `${modelName()}の更新`,
      actions: mode() === 'create'
        ? [{ id: ActionId.CREATE, name: '作成', icon: 'add', color: 'primary' }]
        : [{id: ActionId.UPDATE, name: '更新', icon: 'save', color: 'primary' }],
      fieldMap: undefined as FormFieldMap,
    });
  }, ['components', 'pages', 'form']);

  readonly config = FormPageStore.Config.inject();
  readonly form = input(_computed(() => this.config().form));
  readonly formFlatExcludes = input(_computed(() => this.config().formFlatExcludes));
  readonly entityId = input(_computed(() => this.config().entityId));
  readonly entity = input(_computed(() => this.config().entity));
  readonly title = input(_computed(() => this.config().title));
  readonly actions = input(_computed(() => this.config().actions));
  readonly fieldMap = input(_computed(() => this.config().fieldMap));
  readonly mode = input(_computed(() => this.config().mode));
  readonly navStartActions = input(_computed(() => this.config().navStartActions));
  readonly navEndActions = input(_computed(() => this.config().navEndActions));
  readonly params = injectRouteParams();
  // readonly Model = injectModel();

  readonly isValid = computedAsync(() => {
    return this.form().valueChanges.pipe(
      startWith(null),
      map(() => this.form().valid),
    );
  })

  readonly activatedActions = computed(() => {
    return this.actions().map(action => ({...action, disabled: !this.isValid()}));
  })

  constructor() {
    super();
    effect(() => {
      if (this.entity()) {
        this.form().reset();
        this.form().patchValue(this.entity());
      }
    }, {allowSignalWrites: true});
  }
}

@Component({
  selector: 'pages-form',
  standalone: true,
  imports: [
    RouterOutletFrame,
    FormTemplate,
  ],
  template: `
    <frames-router-outlet>
      <templates-form
        [actions]="store.activatedActions()"
        [navStartActions]="store.navStartActions()"
        [navEndActions]="store.navEndActions()"
        [title]="store.title()"
        [form]="store.form()"
        [formFlatExcludes]="store.formFlatExcludes()"
        [fieldMap]="store.fieldMap()"
        (action)="dispatch($event)"
      />
    </frames-router-outlet>
  `,
  styleUrl: './form.page.scss',
  hostDirectives: [
    {
      directive: FormPageStore,
      inputs: [
        'fieldMap',
        'entityId',
        'entity',
        'mode',
        'navEndActions',
        'actions',
        'title',
        'form',
        'formFlatExcludes',
      ],
    },
  ],
})
export class FormPage extends NgAtomicComponent {
  static readonly ActionId = ActionId;
  protected store = inject(FormPageStore);
  readonly loading = inject(LoadingService);
  readonly snackBar = inject(SnackBarService);

  @Effect(FormTemplate.ActionId.BACK)
  protected back() {
    this.dispatch({id: ActionId.BACK});
  }

  @Effect(FormTemplate.ActionId.FILE_SELECTED)
  protected fileSelected(payload: { scope: string, files: File[]}) {
    this.dispatch({id: ActionId.FILE_SELECTED, payload});
  }
}
