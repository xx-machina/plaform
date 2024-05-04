import dayjs from "dayjs";
import { NotionAnnotation } from "./decorators";

type NotionText = {
  type: 'text', 
  text: { content: string },
  plain_text: string,
}

type NotionArray = {
  type: 'array',
  array: (NotionRichText[] | NotionNumber[]),
  function: 'show_original'
}

export type NotionTitle = {type: 'title', title: {text: {content: string}}[]};
export type NotionUrl = {id: string, type: 'url', url: string | null};
export type NotionRichText = {
  id: string, 
  type: 'rich_text', 
  rich_text: NotionText[]
};
export type NotionNumber = {id: string, type: 'number', number: number};
export type NotionRelation = {id: string, type: 'relation', relation: {id: string}[], has_more: boolean};
export type NotionStatus = {id: string, type: 'status', status: {id: string, name: string, color: string}};
export type NotionFormula = {id: string, type: 'formula', formula: {type: 'string', string: string} | {type: 'number', number: number}};
export type NotionRollup = {id: string, type: 'rollup', rollup: NotionArray};

export type NotionCreatedTime = {id: string, type: 'created_time', created_time: string};
export type NotionLastEditedTime = {id: string, type: 'last_edited_time', last_edited_time: string};
export type NotionDate = {id: string, type: 'date', date: any };
export type NotionSelect = {id: string, type: 'select', select: {id: string, name: string, color: string}};

export type NotionValue = NotionTitle | NotionUrl | NotionRichText | NotionNumber
  | NotionRelation | NotionStatus | NotionFormula | NotionRollup 
  | NotionCreatedTime | NotionLastEditedTime | NotionDate | NotionSelect;

export class NotionUtils {
  static toNotionValue(value: any, annotation: NotionAnnotation) {
    switch(annotation.type) {
      case 'title': return NotionUtils.toNotionTitle(value);
      case 'status': return NotionUtils.toNotionStatus(value);
      case 'relation':
        if ((annotation.options as any).multi) {
          return NotionUtils.toRelationMulti(value);
        } else {
          return NotionUtils.toRelation(value);
        }
      case 'formula': return NotionUtils.toNotionFormula(value);
      case 'rich_text': return NotionUtils.toRichText(value);
      case 'rollup': return NotionUtils.toRollup(value);
      case 'url': return NotionUtils.toUrl(value);
      case 'date': return NotionUtils.toDate(value);
      case 'select': return NotionUtils.toSelect(value);
      // case 'number': return NotionUtils.toNumber(value);
    }
  }

  static toNotionTitle(value: string) {
    return value ? {type: 'title', title: [{text: {content: value}}]} : undefined;
  }

  static toNotionStatus(value: string) {
    return value ? {type: 'status', status: {name: value}} : undefined; 
  }

  static toRelationMulti(ids: string[]) {
    return Array.isArray(ids) ? {type: 'relation', relation: (ids).map(id => ({id}))} : undefined;
  }

  static toRelation(value: string) {
    return value ? this.toRelationMulti([value]) : undefined;
  }
  
  static toRichText(text?: string) {
    return text ? {type: 'rich_text', rich_text: [{text: {content: text}}]} : undefined;
  }
  
  static toNotionFormula(value: string): void {
    return;
  }

  static toRollup(value: string): void {
    return;
  }

  static toUrl(value: string) {
    return value ? {type: 'url', url: value} : undefined;
  }

  static toDate(value: dayjs.Dayjs) {
    // TODO(nontangent): endも考慮する。
    return value ? {type: 'date', date: {start: value.format() }} : undefined;
  }

  static toSelect(value: string) {
    return value ? {type: 'select', select: {name: value}} : undefined;
  }

  static fromNotionValue(value: NotionValue, annotation: NotionAnnotation) {
    switch(value.type) {
      case 'title': return this.fromTitle(value);
      case 'formula': return this.fromFormula(value);
      case 'relation':
        if ((annotation.options as any).multi) {
          return this.fromRelationMulti(value);
        } else {
          return this.fromRelation(value);
        }
      case 'rich_text': return this.fromRichText(value);
      case 'status': return this.fromStatus(value);
      case 'url': return this.fromUrl(value);
      case 'rollup': return this.fromRollup(value);
      case 'created_time': return this.fromCreatedTime(value);
      case 'last_edited_time': return this.fromLastEditedTime(value);
      case 'date': return this.fromDate(value);
      case 'number': return this.fromNumber(value);
      case 'select': return NotionUtils.fromSelect(value);
    }
  }

  static fromTitle(notionTitle: NotionTitle): string {
    return notionTitle?.title?.[0]?.text?.content ?? '';
  }

  static fromUrl(notionUrl: NotionUrl): string | null {
    return notionUrl.url;
  }

  static fromRichText(notionRichText: NotionRichText): string | null {
    return notionRichText.rich_text.map(({plain_text}) => plain_text).join('') || null;
  }

  static fromRelation(notionRelation: NotionRelation): string | null {
    return this.fromRelationMulti(notionRelation)?.[0] ?? null;
  }

  static fromRelationMulti(notionRelation: NotionRelation): string[] {
    return notionRelation.relation.map(r => r.id);
  }

  static fromStatus(notionStatus: NotionStatus): string {
    return notionStatus.status.name;
  }

  static fromFormula(notionFormula: NotionFormula): string | number {
    return notionFormula.formula?.type === 'string'
      ? notionFormula.formula?.string
      : notionFormula.formula?.number;
  }

  static fromRollup(notionRollup: NotionRollup): string[] | number[] {
    return (notionRollup.rollup.array ?? []).map(notionValue => {
      if (notionValue.type === 'rich_text') {
        return (notionValue.rich_text ?? []).map(text => text.plain_text).join();
      } else if (notionValue.type === 'number') {
        return notionValue.number ?? null;
      }
      return [];
    });
  }

  static fromCreatedTime(notionCreatedTime: NotionCreatedTime): dayjs.Dayjs {
    return dayjs(notionCreatedTime.created_time);
  }

  static fromLastEditedTime(notionLastEditedTime: NotionLastEditedTime): dayjs.Dayjs {
    return dayjs(notionLastEditedTime.last_edited_time);
  }

  static fromDate(notionDate: NotionDate): dayjs.Dayjs | null {
    return notionDate.date?.start ? dayjs(notionDate.date?.start) : null;
  }

  static fromNumber(notionNumber: NotionNumber) {
    return notionNumber.number ?? null;
  }

  static fromSelect(notionSelect: NotionSelect) {
    return notionSelect.select?.name ?? null;
  }
}
