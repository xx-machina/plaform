import { toSignal } from '@angular/core/rxjs-interop';
import { InjectionToken, Injector, inject } from '@angular/core';
import { Type } from '@nx-ddd/common/domain/models';
import { ComponentStore } from '@ngrx/component-store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Observable, ReplaySubject, Subject, isObservable, of } from 'rxjs';
import { bufferTime, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { merge } from 'lodash-es';
import { Entity, Task, TaskComposerService } from './task-composer';
import { ProxyIdService } from './proxy-id.service';

export class EntityStoreAdapter<E extends Entity> {
  list?(): Observable<E[]> {
    throw new Error('not implemented');
  }

  create?(entity: E): Promise<E> {
    throw new Error('not implemented');
  }

  update?(entity: Partial<E> & {id: string}): Promise<void> {
    throw new Error('not implemented');
  }

  delete?(entity: Partial<E>  & {id: string}): Promise<void> {
    throw new Error('not implemented');
  }
}

export const ENTITY_STORE_ADAPTER = new InjectionToken<{
  entity: Type<Entity>,
  adapter: EntityStoreAdapter<Entity>
}[]>('ENTITY_STORE_ADAPTER');

export function provideEntityStoreAdapter<E extends Entity>(
  entity: Type<E>,
  adapterFactory: (injector: Injector) => EntityStoreAdapter<E>,
) {
  return {
    provide: ENTITY_STORE_ADAPTER,
    multi: true,
    useFactory: (injector: Injector) => {
      return { entity, adapter: adapterFactory(injector) };
    },
    deps: [Injector]
  };
}

export function injectEntityStoreAdapter<E extends Entity>(entity: Type<E>): EntityStoreAdapter<E> {
  const adapters = inject(ENTITY_STORE_ADAPTER, {optional: true}) ?? [];
  return adapters.find(adapter => adapter.entity === entity)?.adapter as EntityStoreAdapter<E>;
}

export class BaseEntityStore<E extends Entity> extends ComponentStore<EntityState<E>> {
  protected adapter: EntityStoreAdapter<E>;

  protected readonly refresh$ = new ReplaySubject<void>(1);
  protected readonly selectors = this.entityAdapter.getSelectors();
  readonly entities$ = this.select(this.selectors.selectAll);
  readonly entities = toSignal(this.entities$);
  readonly size$ = this.select(this.selectors.selectTotal);
  readonly addOne = this.updater((state, entity: E) => this.entityAdapter.addOne(entity, state));
  readonly addMany = this.updater((state, entities: E[]) => this.entityAdapter.addMany(entities, state));
  readonly updateOne = this.updater((state, update: {id: string, changes: Partial<E>}) => this.entityAdapter.updateOne(update, state));
  readonly updateMany = this.updater((state, updates: {id: string, changes: Partial<E>}[]) => this.entityAdapter.updateMany(updates, state));
  readonly upsertOne = this.updater((state, entity: E) => this.entityAdapter.upsertOne(entity, state));
  readonly upsertMany = this.updater((state, entities: E[]) => this.entityAdapter.upsertMany(entities, state));
  readonly removeOne = this.updater((state, id: string) => this.entityAdapter.removeOne(id, state));
  readonly removeMany = this.updater((state, ids: string[]) => this.entityAdapter.removeMany(ids, state));
  readonly removeAll = this.updater((state) => this.entityAdapter.removeAll(state));
  readonly setOne = this.updater((state, entity: E) => this.entityAdapter.setOne(entity, state));
  readonly setAll = this.updater((state, entities: E[]) => this.entityAdapter.setAll(entities, state));

  constructor(
    protected entity: Type<E>,
    protected entityAdapter: EntityAdapter<E> = createEntityAdapter<E>({selectId: (entity) => entity.id, sortComparer: false}),
  ) {
    super(entityAdapter.getInitialState());
    this.adapter = injectEntityStoreAdapter(entity);
    this.getEntities(this.refresh$);
    this.refresh();
  }

  getEntities = this.effect((refresh$: Observable<void>) => refresh$.pipe(
    switchMap(() => this.adapter?.list() ?? of([])),
    tap((entities: E[]) => this.setAll(entities)),
  ));

  refresh() {
    this.refresh$.next();
  }

  mapToOne(valueOrObs: string | Observable<string>): Observable<E> {
    const wrap = (valueOrObs: string | Observable<string>) => isObservable(valueOrObs) ? valueOrObs : of(valueOrObs);
    return wrap(valueOrObs).pipe(
      switchMap(id => this.select((state) => this.selectors.selectEntities(state)[id])),
    );
  }

}

export class EntityStore<E extends Entity> extends BaseEntityStore<E> {
  protected proxyId = inject(ProxyIdService, {});
  protected composer = inject(TaskComposerService);
  protected taskSubject$ = new Subject<Task<E>>();
  protected task$: Observable<Task<E>> = this.taskSubject$.pipe(
    map(task => {
      switch(task.type) {
        case 'create': return merge(task, {payload: {id: this.proxyId.proxyId(task.payload.id)}});
        default: return task;
      }
    }),
    shareReplay(1),
  );
  protected composedTasks$ = this.task$.pipe(
    bufferTime(5 * 1000),
    filter(tasks => tasks.length > 0),
    map((tasks) => this.composer.composeTasks(tasks)),
  );

  constructor(
    protected entity: Type<E>,
    protected entityAdapter: EntityAdapter<E> = createEntityAdapter<E>({selectId: (entity) => entity.id, sortComparer: false}),
  ) {
    super(entity, entityAdapter);
    this.task$.subscribe((task: Task<E>) => this.runTask(task));
    this.composedTasks$.subscribe(tasks => this.runComposedTasks(tasks));
  }

  dispatch(action: Task<E>) {
    this.taskSubject$.next(action);
  }

  protected async runTask(task: Task<E>): Promise<any> {
    switch(task.type) {
      case 'create': return this.addOne(task.payload);
      case 'update': return this.updateOne({id: task.payload.id, changes: task.payload});
      case 'delete': return this.removeOne(task.payload.id);
    }
  }

  protected async runComposedTasks(tasks: Task<E>[]): Promise<void> {
    return Promise.all(tasks.map((task) => {
      switch(task.type) {
        case 'create': return this.adapter.create(task.payload)
          .then((entity) => {
            this.proxyId.update(task.payload.id, entity.id);
            const _entity = this.state().entities[task.payload.id];
            this.removeOne(task.payload.id);
            this.addOne({..._entity, id: entity.id});
          });
        case 'update': return this.adapter.update({
          ...task.payload,
          id: this.proxyId.resolve(task.payload.id),
        });
        case 'delete': return this.adapter.delete({
          ...task.payload,
          id: this.proxyId.resolve(task.payload.id),
        } as any);
      }
    }))
    .then(() => this.onSyncSucceeded())
    .catch(() => this.onSyncFailed());
  }

  protected onSyncFailed() { }
  protected onSyncSucceeded() { }
}
