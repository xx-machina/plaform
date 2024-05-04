import dayjs from 'dayjs';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FirestoreAdapter } from '../adapters';
import { Converter } from '../converter';
import { FirestoreDAO } from '../dao';
import { FirestorePathBuilder } from '../path-builder';
import { FirestoreCollection,  FirestoreCollectionGroup, ToFirestoreData } from '../interfaces';

type CollectionRef<D> = FirestoreCollection<D> | FirestoreCollectionGroup<D>;
  
export class FirestoreQuery<
  Entity extends {id: string} = any, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> extends FirestoreDAO<Entity, FirestoreData> {

  protected collection$ = new ReplaySubject<CollectionRef<FirestoreData>>(1);
  switchCollection(paramMap?: Partial<Entity>) {
    const collectionRef = paramMap ? this.collection(paramMap) : this.collectionGroup();
    this.collection$.next(collectionRef)
  }

  protected get list$(): Observable<Entity[]> {
    return this._list$ ??= this.collection$.pipe(
      switchMap((collection) => this._listChanges(collection)),
      shareReplay(1),
    );
    
  }
  protected _list$: Observable<Entity[]>;

  constructor(
    adapter: FirestoreAdapter,
    converter: Converter<Entity>,
    protected pathBuilder: FirestorePathBuilder<Entity>
  ) {
    super(adapter, converter);
    this.switchCollection();
  }

  listChanges(paramMap?: Partial<Entity>): Observable<Entity[]> {
    this.switchCollection(paramMap);
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
    return this.list$.pipe(
      take(1),
      map(entities => entities.find(entity => entity.id === id)),
    ).toPromise();
  }

  list(paramMap?: Partial<Entity>) {
    return this.list$.pipe(take(1)).toPromise();
  }

  protected _listChanges(
    collection: FirestoreCollection<FirestoreData> | FirestoreCollectionGroup<FirestoreData>
  ): Observable<Entity[]> {
    const _map = new Map<string, any>();
    return collection.stateChanges().pipe(
      tap(actions => actions.forEach(({type, payload: {doc}}) => {
        if (new Set(['added', 'modified']).has(type)) {
          _map.set(doc.id, this.converter.fromFirestore(doc));
        } else if (type === 'removed') {
          _map.delete(doc.id);
        }
      })),
      map(() => [..._map.values()]),
    );
  }
}
