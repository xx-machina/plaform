export const NOTION_ANNOTATIONS = 'notion_annotations';
export type NotionFieldType = 'title' | 'url' | 'rich_text' 
  | 'relation' | 'status' | 'formula' | 'rollup' | 'timestamp'
  | 'number' | 'created_time' | 'last_edited_time' | 'date' | 'select';
export interface NotionAnnotation<T extends object = undefined> {
  type: NotionFieldType;
  fieldName: string;
  propName: string;
  options?: T;
};

function createDecorator<T extends object = undefined>(type: NotionFieldType, defaultOptions?: T) {
  return (name?: string, options?: Partial<T>) => {
    return (target: any, propName: string) => {
      const fieldName = name || propName;
      const ANNOTATION: NotionAnnotation<T> = {type, fieldName, propName, options: {...defaultOptions, ...options}};
      target.constructor[NOTION_ANNOTATIONS] ??= [];
      target.constructor[NOTION_ANNOTATIONS].push(ANNOTATION);
    };
  };
}

export const Title = createDecorator('title');
export const Url = createDecorator('url');
export const RichText = createDecorator('rich_text');
export const Relation = createDecorator<{multi: boolean}>('relation', {multi: false});
export const Status = createDecorator('status');
export const Formula = createDecorator('formula');
export const Rollup = createDecorator('rollup');
export const Timestamp = createDecorator('timestamp');
export const Number = createDecorator('number');
export const CreatedTime = createDecorator('created_time');
export const LastEditedTime = createDecorator('last_edited_time');
export const Date = createDecorator('date');
export const Select = createDecorator('select');
