// @vitest-environment node
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(__dirname, '../..')
const read = (p: string) => readFileSync(join(root, p), 'utf8')
const manifest = JSON.parse(read('public/manifest.webmanifest')) as Record<string, unknown> & {
  icons: { src: string; sizes: string; type: string; purpose?: string }[]
}
const html = read('index.html')

describe('web app manifest', () => {
  it('has the members required for installability', () => {
    for (const k of ['name', 'short_name', 'start_url', 'display', 'icons', 'theme_color', 'background_color', 'scope', 'id']) {
      expect(manifest, k).toHaveProperty(k)
    }
    expect(manifest.display).toBe('standalone')
    expect(String(manifest.short_name).length).toBeLessThanOrEqual(12)
  })

  it('start_url stays inside scope, and both are relative to the site root (hash routing is untouched)', () => {
    const scope = new URL(String(manifest.scope), 'https://x.example')
    const start = new URL(String(manifest.start_url), 'https://x.example')
    expect(start.pathname.startsWith(scope.pathname)).toBe(true)
    expect(String(manifest.start_url)).not.toContain('#')
  })

  it('theme colour equals the <meta name="theme-color"> already in index.html; colours are valid hex', () => {
    const meta = /<meta name="theme-color" content="(#[0-9a-fA-F]{6})"/.exec(html)?.[1]
    expect(manifest.theme_color).toBe(meta)
    expect(String(manifest.background_color)).toMatch(/^#[0-9a-fA-F]{6}$/)
  })

  it('index.html links the manifest', () => {
    expect(html).toMatch(/<link rel="manifest" href="\/manifest\.webmanifest"\s*\/?>/)
  })

  it('every declared icon exists in public/ and its declared type matches the file', () => {
    expect(manifest.icons.length).toBeGreaterThan(0)
    for (const icon of manifest.icons) {
      const file = join('public', icon.src.replace(/^\//, ''))
      expect(existsSync(join(root, file)), file).toBe(true)
      if (icon.src.endsWith('.svg')) expect(icon.type).toBe('image/svg+xml')
      if (icon.src.endsWith('.png')) expect(icon.type).toBe('image/png')
    }
  })

  it('icons: BilUp snow-leopard mascot PNG set (any + maskable) plus the vector favicon; name equals the page title', () => {
    const title = /<title>([^<]+)<\/title>/.exec(html)?.[1]
    expect(manifest.name).toBe(title)
    const srcs = manifest.icons.map(i => i.src)
    expect(srcs).toEqual(expect.arrayContaining(['/favicon.svg', '/brand/mascot/icon-192.png', '/brand/mascot/icon-512.png']))
    expect(manifest.icons.some(i => i.purpose?.includes('maskable'))).toBe(true)
    for (const i of manifest.icons.filter(i => i.src.endsWith('.png'))) {
      const size = Number(i.sizes.split('x')[0])
      expect(size === 192 || size === 512, i.src).toBe(true)
      expect(statSync(join(root, 'public', i.src)).size, `${i.src} must stay small: it is precached`).toBeLessThan(200_000)
    }
    expect(html).toContain('rel="apple-touch-icon"')
  })

  it('does not declare features outside P0b scope', () => {
    for (const k of ['shortcuts', 'share_target', 'protocol_handlers', 'file_handlers', 'related_applications', 'gcm_sender_id']) {
      expect(manifest, k).not.toHaveProperty(k)
    }
  })
})

describe('remote kill-switch config', () => {
  it('ships enabled by default, as valid JSON with a boolean flag', () => {
    const cfg = JSON.parse(read('public/pwa-config.json'))
    expect(cfg).toEqual({ enabled: true })
  })
})
