export const FIRESTORE_ANNOTATIONS = 'firestore_annotations';
export type FirestoreFieldType = 'id' | 'boolean' | 'number' 
  | 'timestamp' | 'string' | 'geopoint' | 'null' 
  | 'map' | 'array' | 'reference';
export interface FirestoreAnnotation {
  type: FirestoreFieldType;
  fieldName: string;
  propName: string;
  childType: any;
};

function createDecorator(type: FirestoreFieldType, options: {childType?: any} = {}) {
  return (props?: {name?: string}) => {
    return (target: any, propName: string) => {
      const fieldName = props?.name || propName;
      const ANNOTATION: FirestoreAnnotation = {type, fieldName, propName, childType: options.childType};
      target.constructor[FIRESTORE_ANNOTATIONS] ??= [];
      target.constructor[FIRESTORE_ANNOTATIONS].push(ANNOTATION);
    };
  };
}

export function getFirestoreAnnotations(target: any): FirestoreAnnotation[] {
  return target[FIRESTORE_ANNOTATIONS] ?? [];
}

export const ID = createDecorator('id');
export const String = createDecorator('string');
export const Null = createDecorator('null');
export const Geopoint = createDecorator('geopoint');
export const Boolean = createDecorator('boolean');
export const Timestamp = createDecorator('timestamp');
export const Number = createDecorator('number');
export const Map = (childType: () => any, props?: {name?: string}) => createDecorator('map', {childType})(props);
export const Array = (childType: () => any, props?: {name?: string}) => createDecorator('array', {childType})(props);
export const Reference = createDecorator('reference');

export class Firestore {
  static ID = ID;
  static String = String;
  static Null = Null;
  static Geopoint = Geopoint;
  static Boolean = Boolean;
  static Timestamp = Timestamp;
  static Number = Number;
  static Map = Map;
  static Array = Array;
  static Reference = Reference;
}
