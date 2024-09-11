module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
  ],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.spec.ts'],
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.+)': '<rootDir>/tests/$1',
    '@/(.+)': '<rootDir>/src/$1',
  },
  clearMocks: true,
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};
