module.exports = {
  testMatch: ['**/tests/**/*.test.js?(x)', '**/tests/**/*.spec.js?(x)'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  rootDir: './src',
  moduleNameMapper: {
    '^config/(.*)$': '<rootDir>/config/$1',
  },
};
