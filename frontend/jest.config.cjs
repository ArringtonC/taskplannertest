module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['./jest.env.js'],
  setupFilesAfterEnv: ['./setupTests.ts'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  verbose: true,
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  }
}; 