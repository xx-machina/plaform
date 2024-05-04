/* eslint-disable */
export default {
  displayName: 'executors',

  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/ng-atomic/executors',
  preset: '../../jest.preset.js',
};
