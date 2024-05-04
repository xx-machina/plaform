import { toObject } from '@nx-ddd/common/utilities';
import { Dayjs } from 'dayjs';

export type DomainLangMap<Entity> =  Partial<{[K in keyof Entity]: string}>

export interface Entity<Id = string> {
  id: Id | null;
  createdAt?: Dayjs | null;
  updatedAt?: Dayjs | null;
}

export type OmitGetter<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
};

export class Entity { 
  static from<E extends Entity = any>(obj: Partial<OmitGetter<E>>): E {
    return Object.assign(new this(), obj) as E;
  }

  static fromObj<T extends Entity = Entity>(obj: object): T {
    return Object.assign(new this(), {
      id: null,
      createdAt: null,
      updatedAt: null,
      ...obj
    }) as never as T;
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