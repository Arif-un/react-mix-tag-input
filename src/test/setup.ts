import '@testing-library/jest-dom'

import { vi } from 'vitest'
const fn = vi.fn

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: fn(), // deprecated
    removeListener: fn(), // deprecated
    addEventListener: fn(),
    removeEventListener: fn(),
    dispatchEvent: fn(),
  })),
})
