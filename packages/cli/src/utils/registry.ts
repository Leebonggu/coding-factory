import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export interface ModuleEntry {
  name: string
  description: string
  category: string
  path: string
  requiredModules: string[]
  optionalModules: string[]
}

export interface PresetEntry {
  name: string
  description: string
  modules: string[]
  layout: string
  theme: string
}

export interface Registry {
  version: string
  modules: Record<string, ModuleEntry>
  presets: Record<string, PresetEntry>
  themes: string[]
  layouts: string[]
}

export interface ModuleManifest {
  name: string
  description: string
  category: string
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
  requiredModules: string[]
  optionalModules: string[]
  files: Array<{ source: string; target: string }>
  configPatches: unknown[]
  envVars: string[]
}

// Path to the registry directory (relative to the CLI package root)
// When installed, registry lives at the monorepo root
function findRegistryPath(): string {
  // Try relative paths from the CLI dist/src location
  const candidates = [
    resolve(__dirname, '../../../../registry'),
    resolve(__dirname, '../../../registry'),
    resolve(__dirname, '../../registry'),
    resolve(process.cwd(), 'registry'),
  ]

  for (const candidate of candidates) {
    try {
      readFileSync(resolve(candidate, 'registry.json'), 'utf-8')
      return candidate
    } catch {
      // not found, try next
    }
  }

  throw new Error(
    'Could not locate registry directory. Make sure you are running from the coding-factory monorepo root.'
  )
}

let registryPath: string | null = null

function getRegistryPath(): string {
  if (!registryPath) {
    registryPath = findRegistryPath()
  }
  return registryPath
}

export function loadRegistry(): Registry {
  const regPath = getRegistryPath()
  const raw = readFileSync(resolve(regPath, 'registry.json'), 'utf-8')
  return JSON.parse(raw) as Registry
}

export function loadModuleManifest(moduleName: string): ModuleManifest {
  const regPath = getRegistryPath()
  const registry = loadRegistry()
  const moduleEntry = registry.modules[moduleName]

  if (!moduleEntry) {
    throw new Error(`Module "${moduleName}" not found in registry.`)
  }

  const manifestPath = resolve(regPath, moduleEntry.path, 'module.json')
  const raw = readFileSync(manifestPath, 'utf-8')
  return JSON.parse(raw) as ModuleManifest
}

export function getModuleSourceDir(moduleName: string): string {
  const regPath = getRegistryPath()
  const registry = loadRegistry()
  const moduleEntry = registry.modules[moduleName]

  if (!moduleEntry) {
    throw new Error(`Module "${moduleName}" not found in registry.`)
  }

  return resolve(regPath, moduleEntry.path)
}

/**
 * Resolves a module and all its required dependencies (recursive).
 * Returns a deduplicated ordered list starting with deepest dependencies.
 */
export function resolveModuleDependencies(
  moduleNames: string[],
  registry: Registry,
  visited = new Set<string>()
): string[] {
  const result: string[] = []

  for (const name of moduleNames) {
    if (visited.has(name)) continue
    visited.add(name)

    const mod = registry.modules[name]
    if (!mod) {
      throw new Error(`Module "${name}" not found in registry.`)
    }

    // Recurse into required modules first
    if (mod.requiredModules.length > 0) {
      const deps = resolveModuleDependencies(mod.requiredModules, registry, visited)
      result.push(...deps)
    }

    result.push(name)
  }

  return result
}

export function getPreset(presetName: string): PresetEntry {
  const registry = loadRegistry()
  const preset = registry.presets[presetName]
  if (!preset) {
    throw new Error(`Preset "${presetName}" not found in registry.`)
  }
  return preset
}
