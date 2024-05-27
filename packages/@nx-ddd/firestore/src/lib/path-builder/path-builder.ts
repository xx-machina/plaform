type CollectionParamMap<Entity extends {id: string}> = Partial<Entity>;
type DocParamMap<Entity extends {id: string}> = CollectionParamMap<Entity> & Pick<Entity, 'id'>;

export type ExtractParams<T extends string> = 
  T extends `${infer _Start}:${infer Param}/${infer Rest}`
    ? { [K in Param | keyof ExtractParams<Rest>]: string }
    : T extends `${infer _Start}:${infer Param}`
    ? { [K in Param]: string }
    : {};

type Params = ExtractParams<'users/:userId/images/:id'>;

export type ColParam<T extends {readonly collectionPath: string}> = Omit<ExtractParams<T['collectionPath']>, 'id'>;
export type DocParam<T extends {readonly collectionPath: string}> = ColParam<T> & {id: string}; 

export class FirestorePathBuilder<
  Entity extends { id: string },
  Path extends string = string,
> {
  doc(param: DocParamMap<Entity>) {
    return resolvePaths(param, this.paths);
  }

  collection(param: Omit<ExtractParams<Path>, 'id'> | {} = {}) {
    return resolvePaths(param, this.paths.slice(0, -1));
  }

  collectionGroup() {
    return this.paths[this.paths.length-2];
  }

  constructor(private paths: string[]) { }
}

export function pathBuilderFactory<
  E extends { id: string },
  Path extends string = string
>(
  path: Path
): FirestorePathBuilder<E, Path> {
  const paths = parsePath<Path>(path);
  return new FirestorePathBuilder(paths);
};

export function parsePath<Path extends string = string>(path: Path): string[] {
  const paths = path.split('/').filter(p => p.length);
  if (!paths[paths.length-1].startsWith(':')) paths.push(':id');
  return paths;
}

export const resolvePaths = (obj: object, paths: string[]): string => {
  return paths.map((path) => path.startsWith(':') ? resolvePath(obj, path.slice(1)) : path).join('/');
}

const resolvePath = (obj: object, key: string) => {
  if (!obj?.[key]) throw new Error(`Invalid key is detected in resolving paths, key: \`${key}\`, obj: \`${JSON.stringify(obj)}\``);
  return obj?.[key];
}
