import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach } from 'vitest'

const clearStorage = () => {
  if (typeof localStorage !== 'undefined') localStorage.clear() // node-environment tests (PWA worker logic) have no DOM storage
}

beforeEach(clearStorage)
afterEach(() => {
  cleanup()
  clearStorage()
})
