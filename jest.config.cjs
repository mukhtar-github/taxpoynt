const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  moduleDirectories: ['node_modules', '<rootDir>/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^query-string$': '<rootDir>/__mocks__/query-string.js',
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};

module.exports = createJestConfig(customJestConfig);