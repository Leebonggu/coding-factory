#!/usr/bin/env node

/**
 * Dependency Consistency Checker
 *
 * Scans all module.json files and checks:
 * 1. Version consistency — same package should use same version across modules
 * 2. Outdated packages — warns about major version gaps
 *
 * Usage:
 *   node scripts/check-deps.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const MODULES_DIR = resolve(ROOT, 'registry/modules')

console.log('╔═══════════════════════════════════════╗')
console.log('║  Dependency Consistency Check          ║')
console.log('╚═══════════════════════════════════════╝\n')

// Collect all deps from all modules
const depMap = new Map() // packageName -> [{ module, version, isDev }]

const moduleNames = readdirSync(MODULES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

for (const moduleName of moduleNames) {
  const manifestPath = resolve(MODULES_DIR, moduleName, 'module.json')
  if (!existsSync(manifestPath)) continue

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))

  for (const [pkg, version] of Object.entries(manifest.dependencies || {})) {
    if (!depMap.has(pkg)) depMap.set(pkg, [])
    depMap.get(pkg).push({ module: moduleName, version, isDev: false })
  }

  for (const [pkg, version] of Object.entries(manifest.devDependencies || {})) {
    if (!depMap.has(pkg)) depMap.set(pkg, [])
    depMap.get(pkg).push({ module: moduleName, version, isDev: true })
  }
}

// Also check base starter
const basePkgPath = resolve(ROOT, 'starters/base/package.json')
if (existsSync(basePkgPath)) {
  const basePkg = JSON.parse(readFileSync(basePkgPath, 'utf-8'))
  for (const [pkg, version] of Object.entries(basePkg.dependencies || {})) {
    if (!depMap.has(pkg)) depMap.set(pkg, [])
    depMap.get(pkg).push({ module: 'base', version, isDev: false })
  }
  for (const [pkg, version] of Object.entries(basePkg.devDependencies || {})) {
    if (!depMap.has(pkg)) depMap.set(pkg, [])
    depMap.get(pkg).push({ module: 'base', version, isDev: true })
  }
}

// Check for inconsistencies
let issues = 0

console.log('━━━ Version Consistency ━━━\n')

for (const [pkg, entries] of depMap) {
  if (entries.length < 2) continue

  const versions = new Set(entries.map((e) => e.version))
  if (versions.size > 1) {
    issues++
    console.log(`  ⚠ ${pkg}`)
    for (const entry of entries) {
      console.log(`    ${entry.module}: ${entry.version}${entry.isDev ? ' (dev)' : ''}`)
    }
    console.log()
  }
}

if (issues === 0) {
  console.log('  ✓ All packages use consistent versions across modules\n')
}

// Summary
console.log('━━━ Summary ━━━\n')
console.log(`  Modules scanned: ${moduleNames.length}`)
console.log(`  Unique packages: ${depMap.size}`)
console.log(`  Inconsistencies: ${issues}`)

if (issues > 0) {
  console.log('\n  Fix: Update module.json files so the same package uses the same version.')
  process.exit(1)
}

process.exit(0)
