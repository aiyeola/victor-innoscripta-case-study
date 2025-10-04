import type { Config } from 'jest';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  globals: {
    'import.meta': {
      env: {
        VITE_NEWS_API_KEY: 'test-api-key',
        VITE_GUARDIAN_API_KEY: 'test-guardian-key',
        VITE_NEW_YORK_TIMES_API_KEY: 'test-nytimes-key',
      }
    }
  },
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: {
          '@/*': ['src/*'],
        },
        esModuleInterop: true,
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'node',
        isolatedModules: false,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        types: ['vite/client', '@testing-library/jest-dom', 'node'],
      },
    }],
    '^.+\\.jsx?$': ['ts-jest', {
      tsconfig: {
        allowJs: true,
        esModuleInterop: true,
      },
    }],
  },
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|@bundled-es-modules|until-async|strict-event-emitter)/)',
  ],
};

export default config;
