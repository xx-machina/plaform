import 'reflect-metadata';
import dayjs from 'dayjs';
// import { enableFetchMocks } from 'jest-fetch-mock';
import 'dayjs/locale/ja';

// enableFetchMocks();
dayjs.locale('ja');

jest.setTimeout(30_000);

(global as any)['setImmediate'] = (callback, ...args) => {
  return setTimeout(callback, 0, ...args);
};

globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
  // lodash-esをlodashにマッピング
  moduleNameMapper: {
    '^lodash-es$': 'lodash',
    '^node-fetch$': 'fetch',
  },
};
import 'jest-preset-angular/setup-jest';
