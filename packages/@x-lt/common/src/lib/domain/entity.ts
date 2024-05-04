// import { toObject } from '@nx-ddd/common/utilities/to-object';
import { Dayjs } from 'dayjs';
import { toObject } from './utilities';

export type DomainLangMap<Entity> =  Partial<{[K in keyof Entity]: string}>

export interface Entity<Id = string> {
  id: Id | null;
  createdAt: Dayjs | null;
  updatedAt: Dayjs | null;
}

export class Entity {
  static fromObj(obj: Partial<Entity>): Entity {
    return Object.assign(new this(), {
      id: null,
      createdAt: null,
      updatedAt: null,
      ...obj
    }) as never as Entity;
  }

  static toObj(entity: Entity): Entity {
    return toObject(entity) as Entity;
  }

  // static toFlattenObject<T extends object, D>(entity: T): D {
  //   const keys = Object.entries(entity).filter(([_, v]) => isDayjs(v)).map(([k] )=> k);
  //   return {
  //     ...flatten(this.toObject(omit(entity, keys))),
  //     ...this.toObject(pick(entity, keys)),
  //   } as D;
  // }
}