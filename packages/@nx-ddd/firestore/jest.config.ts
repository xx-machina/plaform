/* eslint-disable */
export default {
  displayName: '@nx-ddd/firestore',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: [
    '<rootDir>/src/test-setup.ts'
  ],
  coverageDirectory: '../../../coverage/projects/@nx-ddd/firestore',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: [
    // 'node_modules/(?!.*\\.mjs$)',
    'node_modules/(?!(lodash-es|@angular|@nx-ddd|flat|undici)/)'
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
