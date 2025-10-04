import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock import.meta.env for Vite environment variables
Object.defineProperty(globalThis, 'import.meta', {
  value: {
    env: {
      VITE_NEWS_API_KEY: 'test-newsapi-key',
      VITE_GUARDIAN_API_KEY: 'test-guardian-key',
      VITE_NEW_YORK_TIMES_API_KEY: 'test-nytimes-key',
    },
  },
  writable: true,
  configurable: true,
});

// Mock API service modules that use import.meta
jest.mock('@/services/api/newsapi.service', () => ({
  newsAPIService: require('./__mocks__/news-services.mock').newsAPIService,
}));
jest.mock('@/services/api/guardian.service', () => ({
  guardianService: require('./__mocks__/news-services.mock').guardianService,
}));
jest.mock('@/services/api/nytimes.service', () => ({
  nyTimesService: require('./__mocks__/news-services.mock').nyTimesService,
}));

// Polyfill TextEncoder/TextDecoder for Node.js environment
if (typeof globalThis.TextEncoder === 'undefined') {
  const util = require('util');
  Object.assign(globalThis, { TextEncoder: util.TextEncoder, TextDecoder: util.TextDecoder });
}

// Polyfill TransformStream for Node.js environment
if (typeof globalThis.TransformStream === 'undefined') {
  const { TransformStream } = require('node:stream/web');
  Object.assign(globalThis, { TransformStream });
}

// Polyfill BroadcastChannel for Node.js environment
if (typeof globalThis.BroadcastChannel === 'undefined') {
  class BroadcastChannelMock {
    constructor(public name: string) {}
    postMessage(_message: any) {}
    close() {}
    addEventListener(_type: string, _listener: any) {}
    removeEventListener(_type: string, _listener: any) {}
    dispatchEvent(_event: Event): boolean { return true; }
  }
  Object.assign(globalThis, { BroadcastChannel: BroadcastChannelMock });
}

import { server } from './__mocks__/server';

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers that we may add during the tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
const IntersectionObserverMock = class {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});
