/* eslint-disable */
export default {
  displayName: 'infrastructure',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/infrastructure',
  testEnvironment: 'node',
  moduleNameMapper: {
    'lodash-es': 'lodash',
  },
  preset: '../../jest.preset.js',
};
