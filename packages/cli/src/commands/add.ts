import * as p from '@clack/prompts'
import pc from 'picocolors'
import { resolve } from 'path'
import { loadRegistry, loadModuleManifest } from '../utils/registry.js'
import {
  readFactoryConfig,
  updateFactoryConfigModules,
  applyModule,
  mergeDepsToPackageJson,
  appendEnvVars,
} from '../utils/codegen.js'

function isCancel(value: unknown): boolean {
  return p.isCancel(value)
}

function exitCancel(): never {
  p.cancel('Operation cancelled.')
  process.exit(0)
}

export async function add(moduleName: string): Promise<void> {
  console.log()
  p.intro(pc.bgCyan(pc.black(' Coding Factory ')))

  const targetDir = resolve(process.cwd())
  const registry = loadRegistry()

  // --- Check the module exists in registry ---
  const availableModuleNames = Object.keys(registry.modules)

  if (!registry.modules[moduleName]) {
    p.log.error(
      [
        `Module ${pc.bold(pc.red(moduleName))} not found in registry.`,
        '',
        `  Available modules: ${availableModuleNames.map((m) => pc.cyan(m)).join(', ')}`,
      ].join('\n')
    )
    process.exit(1)
  }

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

  // --- Check if already installed ---
  if (config.modules.includes(moduleName)) {
    p.log.warn(`Module ${pc.bold(pc.yellow(moduleName))} is already installed in this project.`)
    p.outro('Nothing to do.')
    return
  }

  // --- Load module manifest ---
  let manifest
  try {
    manifest = loadModuleManifest(moduleName)
  } catch (err) {
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  // --- Resolve required modules that are missing ---
  const missingRequired = manifest.requiredModules.filter(
    (dep) => !config.modules.includes(dep)
  )

  const modulesToInstall: string[] = []

  for (const dep of missingRequired) {
    const depEntry = registry.modules[dep]
    const depDesc = depEntry ? ` — ${depEntry.description}` : ''

    const addDep = await p.confirm({
      message: `${pc.bold(moduleName)} requires ${pc.cyan(dep)}${depDesc}. Add it too?`,
      initialValue: true,
    })

    if (isCancel(addDep)) exitCancel()

    if (!addDep) {
      p.log.warn(
        `Skipping: ${pc.bold(moduleName)} may not work correctly without ${pc.cyan(dep)}.`
      )
    } else {
      modulesToInstall.push(dep)
    }
  }

  // Add the requested module last (after its deps)
  modulesToInstall.push(moduleName)

  // Collect all manifests for preview
  const manifests = []
  for (const name of modulesToInstall) {
    try {
      manifests.push({ name, manifest: loadModuleManifest(name) })
    } catch {
      manifests.push({ name, manifest: null })
    }
  }

  const allFiles = manifests.flatMap(({ name, manifest: m }) =>
    m ? m.files.map((f) => `${pc.dim(name + ':')} ${f.target}`) : []
  )

  const allDeps = manifests.reduce<Record<string, string>>((acc, { manifest: m }) => {
    return m ? { ...acc, ...m.dependencies } : acc
  }, {})

  const allDevDeps = manifests.reduce<Record<string, string>>((acc, { manifest: m }) => {
    return m ? { ...acc, ...m.devDependencies } : acc
  }, {})

  const allEnvVars = manifests.flatMap(({ manifest: m }) => (m ? m.envVars : []))

  // --- Show summary ---
  const summaryLines: string[] = ['']

  summaryLines.push(`  ${pc.bold('Modules to add:')}  ${modulesToInstall.map((m) => pc.cyan(m)).join(', ')}`)

  if (allFiles.length > 0) {
    summaryLines.push(`  ${pc.bold('Files:')}`)
    allFiles.forEach((f) => summaryLines.push(`    ${f}`))
  }

  if (Object.keys(allDeps).length > 0) {
    summaryLines.push(`  ${pc.bold('Dependencies:')}`)
    Object.entries(allDeps).forEach(([pkg, ver]) =>
      summaryLines.push(`    ${pc.dim(pkg + '@' + ver)}`)
    )
  }

  if (Object.keys(allDevDeps).length > 0) {
    summaryLines.push(`  ${pc.bold('DevDependencies:')}`)
    Object.entries(allDevDeps).forEach(([pkg, ver]) =>
      summaryLines.push(`    ${pc.dim(pkg + '@' + ver)}`)
    )
  }

  if (allEnvVars.length > 0) {
    summaryLines.push(`  ${pc.bold('Env vars:')}  ${allEnvVars.map((v) => pc.yellow(v)).join(', ')}`)
  }

  summaryLines.push('')

  p.log.step(summaryLines.join('\n'))

  // --- Confirm ---
  const confirmed = await p.confirm({
    message: 'Add these modules to your project?',
    initialValue: true,
  })

  if (isCancel(confirmed) || !confirmed) exitCancel()

  // --- Execute ---
  const spinner = p.spinner()

  try {
    for (const { name, manifest: m } of manifests) {
      spinner.start(`Applying module: ${pc.cyan(name)}...`)
      if (m) {
        applyModule(targetDir, name)

        mergeDepsToPackageJson(targetDir, m.dependencies, m.devDependencies)

        appendEnvVars(targetDir, m.envVars)
      } else {
        p.log.warn(`Module "${name}" has no manifest, skipping file copy.`)
      }
      spinner.stop(`Module ${pc.cyan(name)} applied.`)
    }

    spinner.start('Updating factory.config.json...')
    updateFactoryConfigModules(targetDir, modulesToInstall)
    spinner.stop('factory.config.json updated.')
  } catch (err) {
    spinner.stop(pc.red('Failed.'))
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  // --- Success ---
  const nextSteps: string[] = ['  Next steps:']

  if (Object.keys(allDeps).length > 0 || Object.keys(allDevDeps).length > 0) {
    nextSteps.push(`  ${pc.cyan('pnpm install')}   — install new dependencies`)
  }

  if (allEnvVars.length > 0) {
    nextSteps.push(`  ${pc.dim('Fill in new env vars in .env.example / .env.local')}`)
  }

  nextSteps.push(`  ${pc.cyan('pnpm dev')}`)

  p.outro(
    [pc.green(`Module${modulesToInstall.length > 1 ? 's' : ''} added successfully!`), '', ...nextSteps, ''].join('\n')
  )
}
