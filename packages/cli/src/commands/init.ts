import * as p from '@clack/prompts'
import pc from 'picocolors'
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve } from 'path'
import { loadRegistry } from '../utils/registry.js'
import {
  copyBaseStarter,
  applyTheme,
  applyModules,
  scaffoldEnvFile,
  writeFactoryConfig,
} from '../utils/codegen.js'

function isCancel(value: unknown): boolean {
  return p.isCancel(value)
}

function exitCancel(): never {
  p.cancel('Operation cancelled.')
  process.exit(0)
}

export async function init(nameArg?: string): Promise<void> {
  console.log()
  p.intro(pc.bgCyan(pc.black(' Coding Factory ')))

  const registry = loadRegistry()

  // --- Step 1: Project name ---
  let projectName: string

  if (nameArg) {
    projectName = nameArg
    p.log.info(`Project name: ${pc.cyan(projectName)}`)
  } else {
    const name = await p.text({
      message: 'What is your project name?',
      placeholder: 'my-project',
      validate(value) {
        if (!value || value.trim().length === 0) return 'Project name is required.'
        if (!/^[a-z0-9-_]+$/i.test(value)) return 'Only letters, numbers, hyphens and underscores allowed.'
        return undefined
      },
    })

    if (isCancel(name)) exitCancel()
    projectName = (name as string).trim()
  }

  const targetDir = resolve(process.cwd(), projectName)

  if (existsSync(targetDir)) {
    const overwrite = await p.confirm({
      message: `Directory "${projectName}" already exists. Continue anyway?`,
      initialValue: false,
    })
    if (isCancel(overwrite) || !overwrite) exitCancel()
  }

  // --- Step 2: Preset selection ---
  const presetChoices = [
    ...Object.values(registry.presets).map((preset) => ({
      value: preset.name,
      label: pc.bold(preset.name),
      hint: preset.description,
    })),
    {
      value: 'custom',
      label: pc.bold('custom'),
      hint: 'Choose modules manually',
    },
  ]

  const selectedPreset = await p.select({
    message: 'Select a preset',
    options: presetChoices,
  })

  if (isCancel(selectedPreset)) exitCancel()

  // --- Step 3: Theme selection ---
  const themeChoices = registry.themes.map((t) => ({
    value: t,
    label: t,
    hint:
      t === 'default'
        ? 'Clean and minimal'
        : t === 'corporate'
          ? 'Professional business look'
          : 'Fun and vibrant',
  }))

  const selectedTheme = await p.select({
    message: 'Select a theme',
    options: themeChoices,
  })

  if (isCancel(selectedTheme)) exitCancel()

  // --- Step 4: Module selection (custom preset only) ---
  let selectedModules: string[]
  let selectedLayout: string

  if (selectedPreset === 'custom') {
    const moduleOptions = Object.values(registry.modules).map((mod) => ({
      value: mod.name,
      label: `${pc.bold(mod.name)} ${pc.dim(`[${mod.category}]`)}`,
      hint: mod.description,
    }))

    const modules = await p.multiselect({
      message: 'Select modules to include',
      options: moduleOptions,
      required: false,
    })

    if (isCancel(modules)) exitCancel()
    selectedModules = modules as string[]

    const layoutChoices = registry.layouts.map((l) => ({
      value: l,
      label: l,
      hint: l === 'marketing' ? 'Header + footer layout' : 'Sidebar + topbar layout',
    }))

    const layout = await p.select({
      message: 'Select a layout',
      options: layoutChoices,
    })

    if (isCancel(layout)) exitCancel()
    selectedLayout = layout as string
  } else {
    const preset = registry.presets[selectedPreset as string]
    selectedModules = preset.modules
    selectedLayout = preset.layout
  }

  // --- Confirm summary ---
  const presetLabel = selectedPreset === 'custom' ? 'custom' : (selectedPreset as string)

  p.log.step(
    [
      '',
      `  ${pc.bold('Project:')}  ${pc.cyan(projectName)}`,
      `  ${pc.bold('Preset:')}   ${presetLabel}`,
      `  ${pc.bold('Theme:')}    ${selectedTheme as string}`,
      `  ${pc.bold('Modules:')}  ${selectedModules.length > 0 ? selectedModules.join(', ') : pc.dim('none')}`,
      `  ${pc.bold('Layout:')}   ${selectedLayout}`,
      '',
    ].join('\n')
  )

  const confirmed = await p.confirm({
    message: 'Create project with these settings?',
    initialValue: true,
  })

  if (isCancel(confirmed) || !confirmed) exitCancel()

  // --- Execute ---
  const spinner = p.spinner()

  try {
    spinner.start('Copying base starter...')
    copyBaseStarter(targetDir)
    spinner.stop('Base starter copied.')

    spinner.start(`Applying theme: ${selectedTheme as string}...`)
    applyTheme(targetDir, selectedTheme as string)
    spinner.stop(`Theme "${selectedTheme as string}" applied.`)

    if (selectedModules.length > 0) {
      spinner.start(`Applying ${selectedModules.length} module(s)...`)
      applyModules(targetDir, selectedModules)
      spinner.stop('Modules applied.')

      spinner.start('Scaffolding .env.local...')
      scaffoldEnvFile(targetDir, selectedModules)
      spinner.stop('.env.local created.')
    }

    writeFactoryConfig(targetDir, {
      preset: presetLabel,
      theme: selectedTheme as string,
      modules: selectedModules,
      layout: selectedLayout,
    })

    spinner.start('Installing dependencies...')
    try {
      execSync('pnpm install', { cwd: targetDir, stdio: 'pipe' })
      spinner.stop('Dependencies installed.')
    } catch {
      // Try npm as fallback
      try {
        execSync('npm install', { cwd: targetDir, stdio: 'pipe' })
        spinner.stop('Dependencies installed (npm).')
      } catch {
        spinner.stop(pc.yellow('Could not install dependencies automatically.'))
        p.log.warn('Run `pnpm install` or `npm install` manually in the project directory.')
      }
    }
  } catch (err) {
    spinner.stop(pc.red('Failed.'))
    p.log.error(err instanceof Error ? err.message : String(err))
    process.exit(1)
  }

  // --- Success ---
  p.outro(
    [
      pc.green('Project created successfully!'),
      '',
      '  Next steps:',
      `  ${pc.cyan(`cd ${projectName}`)}`,
      `  ${pc.cyan('pnpm dev')}`,
      '',
      selectedModules.length > 0
        ? `  ${pc.dim('Edit .env.local to fill in required environment variables.')}`
        : '',
    ]
      .filter((l) => l !== undefined)
      .join('\n')
  )
}
