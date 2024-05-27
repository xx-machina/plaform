import { toObject } from '../utilities/to-object';
import dayjs, { Dayjs } from 'dayjs';
import { flatten } from 'flat';
import { Transform } from 'class-transformer';
import { merge } from 'lodash-es';

export type Type<E> = { new(): E};
export type DomainLangMap<Entity> =  Partial<{[K in keyof Entity]: string}>

export interface Entity<Id = string> {
  id: Id | null;
  createdAt?: Dayjs | null;
  updatedAt?: Dayjs | null;
}

export type OmitGetter<T> = {
  [P in keyof T as string extends P ? never : number extends P ? never : P]: T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

interface BaseDomainAnnotation {
  type: 'model:lang' | 'prop:lang' | 'prop:type';
}

export interface DomainModelLangAnnotation extends BaseDomainAnnotation {
  type: 'model:lang';
  modelName: string;
  name: string;
  typeFactory?: () => any;
}

export interface DomainPropLangAnnotation extends BaseDomainAnnotation {
  type: 'prop:lang';
  propName: string;
  name: string;
}

export interface DomainPropTypeAnnotation extends BaseDomainAnnotation {
  type: 'prop:type';
  propName: string;
  typeFactory: () => any;
}

export type DomainAnnotation = DomainModelLangAnnotation
  | DomainPropLangAnnotation
  | DomainPropTypeAnnotation;

interface Target {
  constructor: {
    [Domain.ANNOTATIONS]?: DomainAnnotation[];
  }
}

export class Domain {
  static readonly ANNOTATIONS = Symbol('annotations');

  static Lang(name: string) {
    return (target: any, propName: string) => {
      this.registerAnnotation(target.constructor, {propName, type: 'prop:lang', name});
    };
  }

  static Type<T>(typeFactory?: () => T) {
    return (target: any, propName: string) => {
      if (!typeFactory) {
        const type = Reflect.getMetadata('design:type', target as any, propName);
        typeFactory = () => type;
      }
      this.registerAnnotation(target.constructor, {propName, typeFactory, type: 'prop:type'});
    };
  }

  // classをデコレートしてnameをアノテーションする
  static Entity({name}: {name: string}) {
    return (target: any) => {
      this.registerAnnotation(target, {name, type: 'model:lang', modelName: target.name});
    };
  }

  static registerAnnotation(constructor: Target['constructor'], annotation: DomainAnnotation) {
    constructor[this.ANNOTATIONS] ??= [];
    constructor[this.ANNOTATIONS].push(annotation);
  }
}

export type LangMap<E> = Partial<Record<keyof E, string>>;


export function getLangMap<E>(domain: Type<E>, mergeObj: object = {}): LangMap<E> {
  return merge(_getLangMap(domain), mergeObj);
}

function _getLangMap<E>(target: Type<E>): LangMap<E> {
  return flatten(getAnnotations(target).reduce((acc: LangMap<E>, annotation: DomainAnnotation) => {
    switch(annotation.type) {
      case 'prop:lang': {
        acc[annotation.propName] = annotation.name;
        break;
      }
      case 'prop:type': {
        const type = annotation.typeFactory?.();
        acc[annotation.propName] = getLangMap(type);
        break;
      }
    }
    return acc;
  }, {}) ?? {});
}

export function getAnnotations<E>(target: Type<E>): DomainAnnotation[] {
  return (target as any)?.[Domain.ANNOTATIONS] ?? [];
}

/**
 * @deprecated
 * use getProps instead.
 */
export function getDomainProps<E>(target: Type<E>, deps: number = 3, path = ''): string[] {
  return getProps(target, deps, path);
}

export function getProps<E>(target: Type<E>, deps: number = 3, path = ''): string[] {
  return getAnnotations(target).map((annotation: DomainAnnotation) => {
    switch (annotation.type) {
      case 'prop:lang': {
        return `${path}${annotation.propName}`;
      }
      case 'prop:type': {
        if (deps > 0) {
          const type = annotation.typeFactory?.();
          return getProps(type, deps - 1, `${path}${annotation.propName}.`);
        }
        return [];
      }
    }
  }).flat();
}

export function getModelName<E>(target: Type<E>): string {
  return (getAnnotations(target).find(annotation => {
    return annotation.type === 'model:lang';
  }) as DomainModelLangAnnotation)?.name ?? target.name;
}

export class Entity { 
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
}

export function TransformToDayjs() {
  return Transform(({ value }) => {
    if (typeof value === 'undefined') return undefined;
    if (dayjs(value).isValid()) return dayjs(value);
    return value;
  });
}
