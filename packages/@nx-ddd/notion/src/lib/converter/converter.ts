import { PageObjectResponse, PartialPageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Converter } from '@nx-ddd/common/infrastructure/converter';
import { NotionUtils } from "../utils";
import { NotionAnnotation, NOTION_ANNOTATIONS } from "../decorators";
import { omitBy } from "lodash";

export abstract class NotionConverter<E> extends Converter<E> {
  protected abstract Entity;

  fromRecord(page: PageObjectResponse | PartialPageObjectResponse): E {
    const annotations: NotionAnnotation[] = this.Entity[NOTION_ANNOTATIONS];
    const obj = annotations.reduce((obj, annotation) => {
      const value = page['properties'][annotation.fieldName] 
        ? NotionUtils.fromNotionValue(page['properties'][annotation.fieldName], annotation)
        : undefined;
      return {...obj, [annotation.propName]: value};
    }, {id: page.id});
    return (this.Entity as any).from(obj);
  }

  toRecord(entity: Partial<E>): object {
    const annotations: NotionAnnotation[] = this.Entity[NOTION_ANNOTATIONS];
    const data = annotations.reduce((obj, annotation) => ({
      ...obj, [annotation.fieldName]: NotionUtils.toNotionValue(entity[annotation.propName], annotation),
    }), {});
    return omitBy(data, (value) => typeof value === 'undefined');
  }
}

export function createConverter<E = any>(Entity: any): NotionConverter<E> {
  class Converter extends NotionConverter<E> {
    protected Entity = Entity;
  }

  return new Converter();
}
