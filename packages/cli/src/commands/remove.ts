import * as p from '@clack/prompts'
import pc from 'picocolors'
import { resolve } from 'path'
import { loadRegistry, loadModuleManifest } from '../utils/registry.js'
import {
  readFactoryConfig,
  removeModuleFiles,
  removeDepsFromPackageJson,
  removeModuleFromConfig,
} from '../utils/codegen.js'

function isCancel(value: unknown): boolean {
  return p.isCancel(value)
}

function exitCancel(): never {
  p.cancel('Operation cancelled.')
  process.exit(0)
}

export async function remove(moduleName: string): Promise<void> {
  console.log()
  p.intro(pc.bgCyan(pc.black(' Coding Factory ')))

  const targetDir = resolve(process.cwd())
  const registry = loadRegistry()

  // --- Read factory.config.json ---
  const config = readFactoryConfig(targetDir)

  if (!config) {
    p.log.error(
      [
        `No ${pc.bold('factory.config.json')} found in the current directory.`,
        '',
        `  Run ${pc.cyan('factory init')} to initialize a project first.`,
      ].join('\n')
    )
    process.exit(1)
  }

  // --- Check if module is installed ---
  if (!config.modules.includes(moduleName)) {
    p.log.error(
      [
        `Module ${pc.bold(pc.red(moduleName))} is not installed in this project.`,
        '',
        `  Installed modules: ${config.modules.length > 0 ? config.modules.map((m) => pc.cyan(m)).join(', ') : pc.dim('none')}`,
      ].join('\n')
    )
    process.exit(1)
  }

  // --- Check if other installed modules depend on this one ---
  const dependents = config.modules.filter((installedModule) => {
    if (installedModule === moduleName) return false
    const entry = registry.modules[installedModule]
    return entry?.requiredModules.includes(moduleName)
  })

  if (dependents.length > 0) {
    p.log.warn(
      [
        `Cannot remove ${pc.bold(pc.yellow(moduleName))} — the following installed modules depend on it:`,
        '',
        ...dependents.map((d) => `  ${pc.cyan(d)} depends on ${pc.yellow(moduleName)}`),
        '',
        `  Remove ${dependents.map((d) => pc.cyan(d)).join(', ')} first, or remove all of them together.`,
      ].join('\n')
    )
    p.outro(pc.red('Remove aborted.'))
    process.exit(1)
  }

  // --- Load module manifest ---
  let manifest
  try {
    manifest = loadModuleManifest(moduleName)
  } catch (err) {
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  // --- Show what will be removed ---
  const summaryLines: string[] = ['']

  summaryLines.push(`  ${pc.bold('Module to remove:')}  ${pc.red(moduleName)}`)

  if (manifest.files.length > 0) {
    summaryLines.push(`  ${pc.bold('Files to delete:')}`)
    manifest.files.forEach((f) => summaryLines.push(`    ${pc.dim(f.target)}`))
  }

  // Collect deps that are not needed by any remaining module
  const remainingModules = config.modules.filter((m) => m !== moduleName)

  const depsUsedByOthers = new Set<string>()
  const devDepsUsedByOthers = new Set<string>()

  for (const otherModule of remainingModules) {
    try {
      const otherManifest = loadModuleManifest(otherModule)
      Object.keys(otherManifest.dependencies).forEach((d) => depsUsedByOthers.add(d))
      Object.keys(otherManifest.devDependencies).forEach((d) => devDepsUsedByOthers.add(d))
    } catch {
      // skip modules without manifests
    }
  }

  const depsToRemove = Object.keys(manifest.dependencies).filter((d) => !depsUsedByOthers.has(d))
  const devDepsToRemove = Object.keys(manifest.devDependencies).filter((d) => !devDepsUsedByOthers.has(d))

  if (depsToRemove.length > 0) {
    summaryLines.push(`  ${pc.bold('Dependencies to remove:')}`)
    depsToRemove.forEach((d) => summaryLines.push(`    ${pc.dim(d)}`))
  }

  if (devDepsToRemove.length > 0) {
    summaryLines.push(`  ${pc.bold('DevDependencies to remove:')}`)
    devDepsToRemove.forEach((d) => summaryLines.push(`    ${pc.dim(d)}`))
  }

  if (manifest.envVars.length > 0) {
    summaryLines.push(
      `  ${pc.bold('Env vars:')}  ${manifest.envVars.map((v) => pc.yellow(v)).join(', ')}  ${pc.dim('(not removed from .env files)')}`
    )
  }

  summaryLines.push('')

  p.log.step(summaryLines.join('\n'))

  // --- Confirm ---
  const confirmed = await p.confirm({
    message: `Remove ${pc.bold(pc.red(moduleName))} from this project?`,
    initialValue: false,
  })

  if (isCancel(confirmed) || !confirmed) exitCancel()

  // --- Execute ---
  const spinner = p.spinner()

  try {
    spinner.start(`Removing module files: ${pc.red(moduleName)}...`)
    removeModuleFiles(targetDir, manifest)
    spinner.stop(`Module files removed.`)

    if (depsToRemove.length > 0 || devDepsToRemove.length > 0) {
      spinner.start('Updating package.json...')
      removeDepsFromPackageJson(targetDir, depsToRemove, devDepsToRemove)
      spinner.stop('package.json updated.')
    }

    spinner.start('Updating factory.config.json...')
    removeModuleFromConfig(targetDir, moduleName)
    spinner.stop('factory.config.json updated.')
  } catch (err) {
    spinner.stop(pc.red('Failed.'))
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  // --- Success ---
  const nextSteps: string[] = ['  Next steps:']

  if (depsToRemove.length > 0 || devDepsToRemove.length > 0) {
    nextSteps.push(`  ${pc.cyan('pnpm install')}   — sync removed dependencies`)
  }

  if (manifest.envVars.length > 0) {
    nextSteps.push(`  ${pc.dim('Clean up related env vars from .env.example / .env.local if needed')}`)
  }

  nextSteps.push(`  ${pc.cyan('pnpm dev')}`)

  p.outro(
    [pc.green(`Module ${pc.bold(moduleName)} removed successfully!`), '', ...nextSteps, ''].join('\n')
  )
}
