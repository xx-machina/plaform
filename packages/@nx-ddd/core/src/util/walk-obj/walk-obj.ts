import set from 'lodash/set';
import dayjs from 'dayjs';

type OverwriteFunction = (paths: string[], value: any) => [boolean, any] | [boolean];

export function walkObj<T>(obj: T, options: {
  callback: (paths: string[], value: any) => void,
  overwrite: OverwriteFunction,
}, paths: string[] = []) {
  // callbackの結果がfalseのときは再帰を止める
  const [stop, _value] = options.overwrite(paths, obj);
  if (stop) return options.callback(paths, _value);

  if (obj instanceof Array) {
    obj.forEach((item, index) => walkObj(item, options, [...paths, index.toString()]));
  } else if (obj instanceof Object) {
    Object.entries(obj).forEach(([key, value]) => walkObj(value, options, [...paths, key]));
  } else if (obj instanceof Function) {
    // 何もしない
  } else {
    options.callback(paths, obj);
  }
}

export function reconstruct<T>(obj: T, overwrite: OverwriteFunction = () => [false]) {
  const newObj = {};
  walkObj(obj, {
    callback: (paths: string[], value) => {
      if (typeof value === 'undefined') return;
      set(newObj, paths.join('.'), value)
    },
    overwrite,
  });
  return newObj;
}

export function reconstructAsISOString<T>(obj: T) {
  return reconstruct(obj, (paths, value) => {
    if (dayjs.isDayjs(value)) {
      if (value.isValid()) return [true, value.toISOString()];
      return [true, null];
    }
    return [false];
  });
}

type FlattenExcludeDayjs<T> = {
  [K in keyof T]: T[K] extends dayjs.Dayjs ? string : T[K];
}

export function flattenExcludeDayjs<T>(obj: T): FlattenExcludeDayjs<T> {
  const newObj = {};
  walkObj(obj, {
    callback: (paths: string[], value) => {
      if (typeof value === 'undefined') return;
      newObj[paths.join('.')] = value;
    },
    overwrite: (paths, value) => {
      if (dayjs.isDayjs(value)) {
        if (!value.isValid()) {
          return [true, null];
        }
        return [true, value.toISOString()];
      }
      return [false];
    },
  });
  return newObj as FlattenExcludeDayjs<T>;
}
