import { Injectable } from '@nx-ddd/core';
import { Entity } from '@nx-ddd/common/domain/models';
import camelCase from 'lodash.camelcase';
import { FirestoreAdapter } from '../adapters/base';
import { createConverter, FirestoreConverter } from '../converter';
import { pathBuilderFactory } from '../path-builder';
import { FirestoreQuery } from '../query';
import { BaseFirestoreRepository } from '../repository';

export interface Firestore<
  EntityClass extends typeof Entity = any,
  // ConverterClass extends typeof FirestoreConverter = any,
> {
  Entity: EntityClass;
  path?: string;
  // Converter?: ConverterClass;
  Query?: typeof FirestoreQuery;
}

export function FirestoreRepository({
  Entity,
  // Converter,
  Query,
  path,
}: Firestore) {
  return function <T extends { new (...args: any[]): {} }>(target: T): any {
    // const __ConverterClass = Converter ?? FirestoreConverter;
    const __QueryClass = Query ?? FirestoreQuery;
    const __path = path ?? resolvePathByEntity(Entity);

    @Injectable()
    class _ extends BaseFirestoreRepository<typeof Entity> {
      protected pathBuilder = pathBuilderFactory(__path);
      protected collectionPath = __path;
      protected converter = createConverter(Entity, this.adapter);
    
      query = new __QueryClass(this.adapter, this.converter, this.pathBuilder);
    
      constructor(
        adapter: FirestoreAdapter, 
      ) {
        super(adapter);
      }
    };

    Object.defineProperty(_, 'name', {value: target.name, writable: false});

    return _
  }
}

function resolvePathByEntity(EntityClass: typeof Entity): string {
  return `${camelCase(EntityClass.name)}s`;
}
