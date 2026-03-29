#!/usr/bin/env node

/**
 * E2E Preset Test Script
 *
 * Generates a project for each preset, installs deps, and runs `next build`.
 * Exit code 0 = all passed, 1 = at least one failed.
 *
 * Usage:
 *   node scripts/test-presets.mjs              # test all presets
 *   node scripts/test-presets.mjs landing       # test single preset
 *   node scripts/test-presets.mjs --keep        # don't clean up after test
 */

import { cpSync, mkdirSync, existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const TEST_DIR = resolve(ROOT, '..', '.coding-factory-test-output')

// Parse args
const args = process.argv.slice(2)
const keepOutput = args.includes('--keep')
const targetPresets = args.filter((a) => !a.startsWith('--'))

// Load registry
const registry = JSON.parse(readFileSync(resolve(ROOT, 'registry/registry.json'), 'utf-8'))
const presetNames = targetPresets.length > 0 ? targetPresets : Object.keys(registry.presets)

// Resolve module dependencies
function resolveModuleDeps(moduleNames) {
  const resolved = []
  const visited = new Set()
  function walk(name) {
    if (visited.has(name)) return
    visited.add(name)
    const mod = registry.modules[name]
    if (!mod) return
    for (const dep of mod.requiredModules || []) walk(dep)
    resolved.push(name)
  }
  for (const name of moduleNames) walk(name)
  return resolved
}

// Generate a project from preset
function generateProject(presetName) {
  const preset = registry.presets[presetName]
  if (!preset) {
    console.error(`  Unknown preset: ${presetName}`)
    return null
  }

  const targetDir = resolve(TEST_DIR, `${presetName}-project`)
  if (existsSync(targetDir)) rmSync(targetDir, { recursive: true, force: true })

  // Copy base starter
  cpSync(resolve(ROOT, 'starters/base'), targetDir, { recursive: true })

  // Resolve and apply modules
  const modules = resolveModuleDeps(preset.modules)

  for (const modName of modules) {
    const manifestPath = resolve(ROOT, 'registry/modules', modName, 'module.json')
    if (!existsSync(manifestPath)) continue

    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))

    // Copy files
    for (const f of manifest.files) {
      const src = resolve(ROOT, 'registry/modules', modName, f.source)
      const dest = resolve(targetDir, f.target)
      if (existsSync(src)) {
        mkdirSync(dirname(dest), { recursive: true })
        cpSync(src, dest, { recursive: true, force: true })
      }
    }

    // Merge dependencies
    const deps = manifest.dependencies || {}
    const devDeps = manifest.devDependencies || {}
    if (Object.keys(deps).length > 0 || Object.keys(devDeps).length > 0) {
      const pkgPath = resolve(targetDir, 'package.json')
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
      pkg.dependencies = { ...(pkg.dependencies || {}), ...deps }
      pkg.devDependencies = { ...(pkg.devDependencies || {}), ...devDeps }
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
    }
  }

  // Write factory config
  writeFileSync(
    resolve(targetDir, 'factory.config.json'),
    JSON.stringify({ preset: presetName, theme: 'default', modules, layout: preset.layout }, null, 2) + '\n'
  )

  return { targetDir, modules }
}

// Run build for a project
function buildProject(presetName, targetDir) {
  try {
    // Install deps (allow build scripts for prisma etc.)
    execSync('pnpm install --no-frozen-lockfile', {
      cwd: targetDir,
      stdio: 'pipe',
      timeout: 120_000,
      env: { ...process.env, npm_config_ignore_scripts: '' },
    })

    // Prisma generate if db module is present
    if (existsSync(resolve(targetDir, 'prisma/schema.prisma'))) {
      const prismaBin = resolve(targetDir, 'node_modules/.bin/prisma')
      if (existsSync(prismaBin)) {
        execSync(`${prismaBin} generate`, {
          cwd: targetDir,
          stdio: 'pipe',
          timeout: 30_000,
        })
      }
    }

    // Next.js build
    execSync('pnpm exec next build', {
      cwd: targetDir,
      stdio: 'pipe',
      timeout: 180_000,
    })

    return { success: true }
  } catch (error) {
    const stderr = error.stderr?.toString() || ''
    const stdout = error.stdout?.toString() || ''
    return { success: false, error: stderr || stdout }
  }
}

// Main
console.log('╔══════════════════════════════════════╗')
console.log('║   Coding Factory — E2E Preset Test   ║')
console.log('╚══════════════════════════════════════╝')
console.log()

// Ensure CLI is built
console.log('Building CLI...')
execSync('pnpm --filter @coding-factory/cli build', { cwd: ROOT, stdio: 'pipe' })

// Clean test output
if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true })
mkdirSync(TEST_DIR, { recursive: true })

const results = []

for (const presetName of presetNames) {
  console.log(`\n━━━ ${presetName.toUpperCase()} ━━━`)

  // Generate
  process.stdout.write('  Generating... ')
  const project = generateProject(presetName)
  if (!project) {
    results.push({ preset: presetName, success: false, error: 'Generation failed' })
    console.log('FAIL')
    continue
  }
  console.log(`OK (${project.modules.length} modules)`)

  // Build
  process.stdout.write('  Installing + Building... ')
  const buildResult = buildProject(presetName, project.targetDir)

  if (buildResult.success) {
    console.log('OK ✓')
    results.push({ preset: presetName, success: true })
  } else {
    console.log('FAIL ✗')
    // Show last 10 lines of error
    const errorLines = buildResult.error.split('\n').filter(Boolean).slice(-10)
    for (const line of errorLines) {
      console.log(`    ${line}`)
    }
    results.push({ preset: presetName, success: false, error: buildResult.error })
  }
}

// Summary
console.log('\n━━━ RESULTS ━━━')
const passed = results.filter((r) => r.success).length
const failed = results.filter((r) => !r.success).length

for (const r of results) {
  console.log(`  ${r.success ? '✓' : '✗'} ${r.preset}`)
}
console.log(`\n  ${passed} passed, ${failed} failed`)

// Cleanup
if (!keepOutput && failed === 0) {
  rmSync(TEST_DIR, { recursive: true, force: true })
  console.log('  (test output cleaned)')
} else if (failed > 0) {
  console.log(`  (test output kept at ${TEST_DIR})`)
}

process.exit(failed > 0 ? 1 : 0)
