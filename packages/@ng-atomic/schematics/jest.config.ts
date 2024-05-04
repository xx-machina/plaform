/* eslint-disable */
export default {
  displayName: 'schematics',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/ng-atomic/schematics',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
