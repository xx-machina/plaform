import dayjs from 'dayjs';
import { Observable, ReplaySubject, lastValueFrom } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FirestoreAdapter } from '../adapters/base';
import { FirestoreConverter } from '../converter';
import { FirestoreDAO } from '../dao';
import { FirestorePathBuilder } from '../path-builder';
import { FirestoreCollection,  FirestoreCollectionGroup, ToFirestoreData } from '../interfaces';

type FirestoreCollectionType<D> = FirestoreCollection<D> | FirestoreCollectionGroup<D>;
  
export class FirestoreQuery<
  Entity extends {id: string} = any, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> extends FirestoreDAO<Entity, FirestoreData> {
  constructor(
    adapter: FirestoreAdapter,
    converter: FirestoreConverter<Entity>,
    protected pathBuilder: FirestorePathBuilder<Entity>
  ) {
    super(adapter, converter);
    this.switchCollectionRef();
  }

  protected readonly collection$ = new ReplaySubject<FirestoreCollectionType<FirestoreData>>(1);
  protected readonly list$ = this.collection$.pipe(
    switchMap((collection) => this.listChangesByCollectionRef(collection)),
    shareReplay(1),
  )

  listChanges(paramMap?: Partial<Entity>): Observable<Entity[]> {
    this.switchCollectionRef(paramMap);
    return this.list$;
  }

  changes({id}: Partial<Entity>) {
    if (!id) throw new Error(`Invalid Id. it must be Truthy`);

    return this.list$.pipe(
      map(entities => entities.find(entity => entity.id === id)),
      distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    );
  }

  get({id}: Partial<Entity> & {id: string}) {
    return lastValueFrom(this.list$.pipe(
      take(1),
      map(entities => entities.find(entity => entity.id === id)),
    ));
  }

  list(paramMap?: Partial<Entity>) {
    this.switchCollectionRef(paramMap);
    return lastValueFrom(this.list$.pipe(take(1)));
  }

  protected listChangesByCollectionRef(
    collection: FirestoreCollection<FirestoreData> | FirestoreCollectionGroup<FirestoreData>
  ): Observable<Entity[]> {
    const entitiesMap = new Map<string, any>();
    return collection.stateChanges().pipe(
      tap(actions => actions.forEach(({type, payload: {doc}}) => {
        if (new Set(['added', 'modified']).has(type)) {
          entitiesMap.set(doc.id, this.converter.fromFirestore((doc as any)));
        } else if (type === 'removed') {
          entitiesMap.delete(doc.id);
        }
      })),
      map(() => [...entitiesMap.values()]),
    );
  }

  protected switchCollectionRef(paramMap?: Partial<Entity>) {
    const collection = this.getCollection(paramMap);
    this.collection$.next(collection);
  }
}
