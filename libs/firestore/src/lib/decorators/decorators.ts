export const FIRESTORE_ANNOTATIONS = 'firestore_annotations';
export type FirestoreFieldType = 'boolean' | 'number' 
  | 'timestamp' | 'string' | 'geopoint' | 'null' 
  | 'map' | 'array' | 'reference';
export interface FirestoreAnnotation {
  type: FirestoreFieldType;
  fieldName: string;
  propName: string;
};

function createDecorator(type: FirestoreFieldType) {
  return (props?: {name?: string}) => {
    return (target: any, propName: string) => {
      const fieldName = props?.name || propName;
      const ANNOTATION: FirestoreAnnotation = {type, fieldName, propName};
      target.constructor[FIRESTORE_ANNOTATIONS] ??= [];
      target.constructor[FIRESTORE_ANNOTATIONS].push(ANNOTATION);
    };
  };
}

export const String = createDecorator('string');
export const Null = createDecorator('null');
export const Geopoint = createDecorator('geopoint');
export const Boolean = createDecorator('boolean');
export const Timestamp = createDecorator('timestamp');
export const Number = createDecorator('number');
export const Map = createDecorator('map');
export const Array = createDecorator('array');
export const Reference = createDecorator('reference');
