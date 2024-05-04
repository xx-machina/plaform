import { NotionAnnotation, NOTION_ANNOTATIONS } from "../decorators";
import { Entity } from "@nx-ddd/common/domain/models";

type Evaluation = '==' | '>' | '>=' | '<' | '<=' | '!=' | 'in';

export class N {
  static RollupPropQuery(property: string, evaluation: Evaluation, value: string | number) {
    return { property, rollup: { every: { rich_text: { equals: value } } } };
  }

  static FormulaQuery(property: string, evaluation: Evaluation, value: string | number) {
    return { property, formula: {}};
  }

  static LastEditedTime(property: string, evaluation: Evaluation, value: string | number) {
    const query = evaluation === '>' ? 'after' 
      : evaluation === '<' ? 'before'
      : evaluation === '==' ? 'equals'
      : evaluation === '<=' ? 'on_or_before'
      : evaluation === '>=' ? 'on_or_after'
      : evaluation === '!=' ? '' : '';
    return { timestamp: 'last_edited_time', last_edited_time: {[query]: value} };
  }

  static Timestamp(property: string, evaluation: Evaluation, value: string) {
    const query = evaluation === '>' ? 'after' 
    : evaluation === '<' ? 'before'
    : evaluation === '==' ? 'equals'
    : evaluation === '<=' ? 'on_or_before'
    : evaluation === '>=' ? 'on_or_after'
    : evaluation === '!=' ? '' : '';
    return { property, timestamp: {[query]: value} };
  }

  static Status(property: string, evaluation: Evaluation, value: string) {
    const query = evaluation === '==' ? 'equals' : '';
    // TODO(nontangent): 'ステータス'を修正
    return { property: 'ステータス', status: {[query]: value} };
  }
  
  static Relation(property: string, evaluation: Evaluation, value: string) {
    const query = evaluation === 'in' ? 'contains': '';
    return { property, relation: {[query]: value} };
  }
}

export abstract class NotionBaseQuery {
  type: 'and' | 'or' | 'filter' | 'sort';
  abstract build();
}

export class NotionFilter extends NotionBaseQuery {
  readonly type: 'filter' = 'filter';

  constructor(
    public propertyType: any,
    public propertyName: string,
    public evaluation: Evaluation,
    public value: string | number,
  ) { super(); }

  build() {
    switch(this.propertyName) {
      case 'last_edited_time': return N.LastEditedTime(this.propertyName, this.evaluation, this.value);
    }

    switch(this.propertyType) {
      case 'rollup': return N.RollupPropQuery(this.propertyName, this.evaluation, this.value);
      case 'formula': return N.FormulaQuery(this.propertyName, this.evaluation, this.value);
      case 'status': return N.Status(this.propertyName, this.evaluation, this.value as string);
      case 'relation': return N.Relation(this.propertyName, this.evaluation, this.value as string);
    }
  }
}

export class NotionSort extends NotionBaseQuery {
  readonly type: 'sort' = 'sort';
  constructor(
    public property: string,
    public direction: 'asc' | 'desc' = 'asc',
  ) { super(); }

  build() {
    return {
      property: this.property,
      direction: this.direction === 'asc' ? 'ascending' : 'descending',
    };
  }
}

export class NotionAnd extends NotionBaseQuery {
  readonly type: 'and' = 'and';
  arr: NotionFilter[];

  constructor(...filters: NotionFilter[]) {
    super();
    this.arr = filters;
  }

  build() {
    return {and: this.arr.map(filter => filter.build())};
  }
}

export class NotionOr extends NotionBaseQuery {
  readonly type: 'or' = 'or';
  arr: NotionFilter[];

  constructor(...filters: NotionFilter[]) {
    super();
    this.arr = filters;
  }

  build() {
    return {or: this.arr.map(filter => filter.build())};
  }
}

export const Query = <E extends typeof Entity<any>>(Entity: E) => {
  const Filter = (_propName: string, evaluation: Evaluation, value: string | number): NotionFilter => {
    const annotation: NotionAnnotation = Entity[NOTION_ANNOTATIONS].find(({propName}) => propName === _propName);
    // TODO(nontangent): propertyが無いときはエラーにした方が良いかもしれない。
    return new NotionFilter(annotation?.type, annotation?.fieldName ?? _propName, evaluation, value);
  };
  const OrderBy = (_propName: string, direction: 'asc' | 'desc'): NotionSort => {
    const annotation: NotionAnnotation = Entity[NOTION_ANNOTATIONS].find(({propName}) => propName === _propName);
    return new NotionSort(annotation?.fieldName ?? _propName, direction);
  };
  
  const And = (...args: NotionFilter[]): NotionAnd => new NotionAnd(...args);
  const Or = (...args: NotionFilter[]): NotionOr => new NotionOr(...args);

  return {Filter, OrderBy, And, Or};
}
