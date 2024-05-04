/* eslint-disable */
export default {
  displayName: 'domain',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/domain',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
