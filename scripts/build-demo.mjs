#!/usr/bin/env node

/**
 * Build Demo Site
 *
 * Generates a demo project from starters/base + starters/demo pages,
 * ready for deployment to Vercel or any static host.
 *
 * Usage:
 *   node scripts/build-demo.mjs          # generate + build
 *   node scripts/build-demo.mjs --only-generate  # generate only (no build)
 */

import { cpSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const DEMO_OUT = resolve(ROOT, '..', '.coding-factory-demo')

const onlyGenerate = process.argv.includes('--only-generate')

console.log('Building Coding Factory demo site...\n')

// Clean
if (existsSync(DEMO_OUT)) rmSync(DEMO_OUT, { recursive: true, force: true })

// Copy base starter
console.log('1. Copying base starter...')
cpSync(resolve(ROOT, 'starters/base'), DEMO_OUT, { recursive: true })

// Overlay demo pages
console.log('2. Overlaying demo pages...')
cpSync(resolve(ROOT, 'starters/demo/src'), resolve(DEMO_OUT, 'src'), { recursive: true, force: true })

// Install
console.log('3. Installing dependencies...')
execSync('pnpm install --no-frozen-lockfile', {
  cwd: DEMO_OUT,
  stdio: 'inherit',
  timeout: 120_000,
})

if (!onlyGenerate) {
  // Build
  console.log('\n4. Building...')
  execSync('pnpm exec next build', {
    cwd: DEMO_OUT,
    stdio: 'inherit',
    timeout: 180_000,
  })
}

console.log(`\nDemo site ready at: ${DEMO_OUT}`)
console.log('Run: cd ' + DEMO_OUT + ' && pnpm dev')
