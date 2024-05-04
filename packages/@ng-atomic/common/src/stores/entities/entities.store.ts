import { ComponentStore } from '@ngrx/component-store';
import { ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export const distinctUntilChangedArray = <T>() => {
  return distinctUntilChanged<T>((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur));
};

export abstract class EntitiesStore<
  E extends {id: string},
  S extends EntityState<E> = any,
> extends ComponentStore<S> {
  constructor(
    protected adapter: EntityAdapter<E> = createEntityAdapter<E>({
      selectId: (entity) => entity.id,
      sortComparer: false,
    }),
  ) {
    super(adapter.getInitialState() as S);
    this.refresh();
  }

  protected readonly refresh$ = new ReplaySubject<void>(1);
  protected readonly selectors = this.adapter.getSelectors();

  get entities() { return this.selectors.selectAll(this.get()); }

  entities$ = this.select(this.selectors.selectAll);
  size$ = this.select(this.selectors.selectTotal);
  
  setEntities = this.updater((state, entities: E[]) => this.adapter.setAll(entities, state));

  abstract getEntities: ReturnType<typeof this.effect>;

  refresh() {
    this.refresh$.next();
  }
}
