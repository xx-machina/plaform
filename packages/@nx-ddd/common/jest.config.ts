/* eslint-disable */
export default {
  displayName: 'common',

  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/@nx-ddd/common',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
