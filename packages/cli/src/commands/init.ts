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

interface InitOptions {
  preset?: string
  theme?: string
}

function isCancel(value: unknown): boolean {
  return p.isCancel(value)
}

function exitCancel(): never {
  p.cancel('Operation cancelled.')
  process.exit(0)
}

export async function init(nameArg: string | undefined, options: InitOptions): Promise<void> {
  const registry = loadRegistry()
  const isNonInteractive = !!(options.preset && options.theme)

  if (!isNonInteractive) {
    console.log()
    p.intro(pc.bgCyan(pc.black(' Coding Factory ')))
  }

  // --- Step 1: Project name ---
  let projectName: string

  if (nameArg) {
    projectName = nameArg
    if (!isNonInteractive) p.log.info(`Project name: ${pc.cyan(projectName)}`)
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
    if (isNonInteractive) {
      // Non-interactive: overwrite silently
    } else {
      const overwrite = await p.confirm({
        message: `Directory "${projectName}" already exists. Continue anyway?`,
        initialValue: false,
      })
      if (isCancel(overwrite) || !overwrite) exitCancel()
    }
  }

  // --- Step 2: Preset selection ---
  let selectedPreset: string

  if (options.preset) {
    if (!registry.presets[options.preset] && options.preset !== 'custom') {
      console.error(`Unknown preset: ${options.preset}`)
      console.error(`Available: ${Object.keys(registry.presets).join(', ')}, custom`)
      process.exit(1)
    }
    selectedPreset = options.preset
  } else {
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

    const result = await p.select({
      message: 'Select a preset',
      options: presetChoices,
    })

    if (isCancel(result)) exitCancel()
    selectedPreset = result as string
  }

  // --- Step 3: Theme selection ---
  let selectedTheme: string

  if (options.theme) {
    if (!registry.themes.includes(options.theme)) {
      console.error(`Unknown theme: ${options.theme}`)
      console.error(`Available: ${registry.themes.join(', ')}`)
      process.exit(1)
    }
    selectedTheme = options.theme
  } else {
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

    const result = await p.select({
      message: 'Select a theme',
      options: themeChoices,
    })

    if (isCancel(result)) exitCancel()
    selectedTheme = result as string
  }

  // --- Step 4: Module selection (custom preset only) ---
  let selectedModules: string[]
  let selectedLayout: string

  if (selectedPreset === 'custom') {
    if (isNonInteractive) {
      selectedModules = []
      selectedLayout = 'marketing'
    } else {
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
    }
  } else {
    const preset = registry.presets[selectedPreset]
    selectedModules = preset.modules
    selectedLayout = preset.layout
  }

  // --- Confirm summary ---
  const presetLabel = selectedPreset === 'custom' ? 'custom' : selectedPreset

  if (isNonInteractive) {
    console.log(`Creating ${pc.cyan(projectName)} with preset ${pc.bold(presetLabel)}, theme ${pc.bold(selectedTheme)}...`)
  } else {
    p.log.step(
      [
        '',
        `  ${pc.bold('Project:')}  ${pc.cyan(projectName)}`,
        `  ${pc.bold('Preset:')}   ${presetLabel}`,
        `  ${pc.bold('Theme:')}    ${selectedTheme}`,
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
  }

  // --- Execute ---
  const spinner = isNonInteractive ? null : p.spinner()

  try {
    spinner?.start('Copying base starter...')
    copyBaseStarter(targetDir)
    if (isNonInteractive) console.log('  Base starter copied.')
    else spinner?.stop('Base starter copied.')

    spinner?.start(`Applying theme: ${selectedTheme}...`)
    applyTheme(targetDir, selectedTheme)
    if (isNonInteractive) console.log(`  Theme "${selectedTheme}" applied.`)
    else spinner?.stop(`Theme "${selectedTheme}" applied.`)

    if (selectedModules.length > 0) {
      spinner?.start(`Applying ${selectedModules.length} module(s)...`)
      applyModules(targetDir, selectedModules)
      if (isNonInteractive) console.log(`  ${selectedModules.length} module(s) applied.`)
      else spinner?.stop('Modules applied.')

      spinner?.start('Scaffolding .env.local...')
      scaffoldEnvFile(targetDir, selectedModules)
      if (isNonInteractive) console.log('  .env.local created.')
      else spinner?.stop('.env.local created.')
    }

    writeFactoryConfig(targetDir, {
      preset: presetLabel,
      theme: selectedTheme,
      modules: selectedModules,
      layout: selectedLayout,
    })

    spinner?.start('Installing dependencies...')
    try {
      execSync('pnpm install', { cwd: targetDir, stdio: 'pipe' })
      if (isNonInteractive) console.log('  Dependencies installed.')
      else spinner?.stop('Dependencies installed.')
    } catch {
      try {
        execSync('npm install', { cwd: targetDir, stdio: 'pipe' })
        if (isNonInteractive) console.log('  Dependencies installed (npm).')
        else spinner?.stop('Dependencies installed (npm).')
      } catch {
        if (isNonInteractive) console.log('  Could not install dependencies automatically.')
        else {
          spinner?.stop(pc.yellow('Could not install dependencies automatically.'))
          p.log.warn('Run `pnpm install` or `npm install` manually in the project directory.')
        }
      }
    }
  } catch (err) {
    spinner?.stop(pc.red('Failed.'))
    const message = err instanceof Error ? err.message : String(err)
    if (isNonInteractive) {
      console.error(message)
    } else {
      p.log.error(message)
    }
    process.exit(1)
  }

  // --- Success ---
  if (isNonInteractive) {
    console.log(`\nDone! Project created at ${pc.cyan(targetDir)}`)
  } else {
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
}
