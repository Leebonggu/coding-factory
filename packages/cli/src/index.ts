#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init.js'

const program = new Command()

program
  .name('factory')
  .description('Coding Factory - Modular web project generator')
  .version('0.1.0')

program
  .command('init')
  .description('Create a new project from a preset')
  .argument('[name]', 'Project name')
  .action(init)

// Phase 2: add command
// program
//   .command('add')
//   .description('Add a module to existing project')
//   .argument('<module>', 'Module name')
//   .action(add)

program.parse()
