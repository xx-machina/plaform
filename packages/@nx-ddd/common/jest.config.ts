/* eslint-disable */
export default {
  displayName: 'common',

  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/packages/@nx-ddd/common',
  testEnvironment: 'node',
  preset: '../../jest.preset.js',
};
