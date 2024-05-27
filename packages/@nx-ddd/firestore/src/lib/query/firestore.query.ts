import dayjs from 'dayjs';
import { Observable, ReplaySubject, lastValueFrom, of, throwError } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, take, tap } from 'rxjs/operators';
import { FirestoreAdapter } from '../adapters/base';
import { IFirestoreConverter } from '../converter';
import { FirestoreDAO } from '../dao';
import { FirestorePathBuilder } from '../path-builder';
import { DocumentSnapshot, CollectionReference,  CollectionGroup, ToFirestoreData, CollectionLike } from '../interfaces';

export class FirestoreQuery<
  Entity extends {id: string} = any, 
  FirestoreData = ToFirestoreData<Entity, dayjs.Dayjs>,
> extends FirestoreDAO<Entity, FirestoreData> {
  constructor(
    adapter: FirestoreAdapter,
    protected converter: IFirestoreConverter<Entity>,
    protected pathBuilder: FirestorePathBuilder<Entity>
  ) {
    super(adapter);
    this.switchCollectionRef();
  }

  protected readonly collection$ = new ReplaySubject<CollectionLike<FirestoreData>>(1);
  protected readonly list$ = this.collection$.pipe(
    switchMap((collection) => this.listChangesByCollectionRef(collection).pipe(
      catchError(error => throwError(() => error)),
    )),
    shareReplay(1),
  )

  /** @deprecated */
  listChanges(paramMap?: Partial<Entity>, options: {switch?: boolean} = {switch: true}): Observable<Entity[]> {
    return of(paramMap).pipe(
      tap((paramMap) => options?.switch && this.switchCollectionRef(paramMap)),
      switchMap(() => this.list$),
    );
  }

  listChangesV2(paramMap?: Partial<Entity>): Observable<Entity[]> {
    return of(paramMap).pipe(
      tap((paramMap) => paramMap && this.switchCollectionRef(paramMap)),
      switchMap(() => this.list$),
    );
  }

  listChangesAfter(updatedAt: dayjs.Dayjs, {limit}: {limit?: number} = {}) {
    const entitiesMap = new Map<string, Entity>();
    const _updatedAt = dayjs.isDayjs(updatedAt) ? this.adapter.convertDateToTimestamp(updatedAt) : updatedAt
    return this.adapter.query(
      this.collection(),
      ...[
        this.adapter.where('updatedAt', '>', _updatedAt),
        this.adapter.orderBy('updatedAt', 'asc'),
        limit ? this.adapter.limit(limit) : undefined,
      ].filter(Boolean),
    ).stateChanges().pipe(
      // bufferTime(1_000),
      // map(zippedActions => zippedActions.flat()),
      tap(actions => actions.forEach(({type, payload: {doc}}) => {
        if (new Set(['added', 'modified']).has(type)) {
          entitiesMap.set(doc.id, this.converter.fromFirestore(doc as DocumentSnapshot<any>));
        } else if (type === 'removed') {
          entitiesMap.delete(doc.id);
        }
      })),
      map(() => [...entitiesMap.values()]),
    );
  }

  changes({id}: Partial<Entity>) {
    if (!id) throw new Error(`Invalid Id. it must be Truthy`);
    return this.list$.pipe(
      map(entities => entities.find(entity => entity.id === id)),
      distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    );
  }

  changesV2(params: Partial<Entity>): Observable<Entity> {
    const docRef = this.doc(params as any);
    return docRef.stateChanges().pipe(
      map((doc) => this.converter.fromFirestore((doc as any))),
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
    collection: CollectionReference<FirestoreData> | CollectionGroup<FirestoreData>
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
    this.switchCollection(collection);
  }

  switchCollection(collection: CollectionLike<any>) {
    this.collection$.next(collection);
  }
}
