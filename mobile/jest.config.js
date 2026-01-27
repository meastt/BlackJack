module.exports = {
  preset: 'react-native',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@card-counter-ai)/)',
  ],
  moduleNameMapper: {
    '^@card-counter-ai/shared$': '<rootDir>/../shared/src',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx',
  ],
  coverageThreshold: {
    // Only enforce coverage on critical game logic, not UI components
    './src/utils/BlackjackGameEngine.ts': {
      statements: 95,
      branches: 90,
      functions: 100,
      lines: 95,
    },
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
