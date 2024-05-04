import { Dayjs } from 'dayjs';
import { Injectable } from '@nx-ddd/core';
import pick from 'lodash.pick';
import { FirestoreAdapter } from '../adapters/base';
import { DocumentSnapshot, ToFirestoreData } from '../interfaces';
import { FirestoreAnnotation, FIRESTORE_ANNOTATIONS } from '../decorators';


@Injectable()
export class FirestoreConverter<Entity = any, Data = ToFirestoreData<Entity, Dayjs>> {
  protected Entity: any;
  protected adapter: FirestoreAdapter<any>;

  private get fields(): string[] {
    const annotations = this.Entity[FIRESTORE_ANNOTATIONS] as FirestoreAnnotation[];
    return annotations.map(a => a.fieldName);
  }

  fromRecord<Data>(doc: DocumentSnapshot<Data>): Entity {
    return this.Entity.fromObj(this.adapter.fromFirestoreData({
      ...doc.data(),
      id: doc.id
    }));
  }

  toRecord<Entity>(entity: Entity): Data {
    const data = this.adapter.toFirestoreData<Entity>(this.Entity.toObj(entity));
    return pick(data, this.fields) as Data;
  }
}

export function createConverter<E = any>(
  Entity: any,
  adapter: FirestoreAdapter
): FirestoreConverter<E> {
  class Converter extends FirestoreConverter<E> {
    protected Entity = Entity;
    protected adapter = adapter;
  }

  return new Converter();
}
