module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(test).[tj]s'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  roots: ['<rootDir>/orchestration'],
};
