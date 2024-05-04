import _get from 'lodash.get';

// ネストされたオブジェクトのキーの組み合わせを生成する型ヘルパー
export type PathKeys<T> = T extends object ? {
  [K in keyof T]-?: K extends string | number ?
    T[K] extends object ? [K] | [K, ...PathKeys<T[K]>] : [K]
    : never
}[keyof T] : [];

// ネストされたパスに対応する型を抽出するための型ヘルパー
export type NestedGetType<T, P extends any[]> = 
  P extends [infer F, ...infer R]
    ? F extends keyof T
      ? NestedGetType<T[F], R>
      : never
    : T;

export function get<T, P extends PathKeys<T>>(obj: T, path: P): NestedGetType<T, P> {
  return _get(obj, path);
};