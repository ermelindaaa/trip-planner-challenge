  
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  roots: ['<rootDir>/src'], 
  testMatch: ['**/*.test.ts'], 

};
