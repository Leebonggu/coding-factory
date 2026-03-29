#!/usr/bin/env node
import { Command } from 'commander'
import { init } from './commands/init.js'
import { add } from './commands/add.js'
import { remove } from './commands/remove.js'

const program = new Command()

program
  .name('factory')
  .description('Coding Factory — 모듈 조합으로 웹 프로젝트를 빠르게 생성하는 CLI')
  .version('0.1.0')
  .addHelpText('after', `
Examples:
  $ factory init my-project                          # 인터렉티브 모드
  $ factory init my-project --preset landing         # 프리셋 지정
  $ factory init my-app --preset saas --theme corporate  # 프롬프트 없이 바로 생성
  $ factory add payments                             # 현재 프로젝트에 모듈 추가
  $ factory remove ads                               # 모듈 제거

Presets:
  landing     — seo + analytics + ads
  saas        — auth + db + security + analytics + seo
  ecommerce   — auth + db + security + seo + analytics + ads + payments

Modules:
  seo, analytics, ads, security, auth, db, payments

Themes:
  default, corporate, playful`)

program
  .command('init')
  .description('Create a new project from a preset')
  .argument('[name]', 'Project name')
  .option('--preset <preset>', 'Preset (landing, saas, ecommerce, custom)')
  .option('--theme <theme>', 'Theme (default, corporate, playful)')
  .addHelpText('after', `
Examples:
  $ factory init                                     # 전부 인터렉티브
  $ factory init my-project                          # 이름만 지정
  $ factory init my-project --preset landing         # 프리셋 지정 (테마는 프롬프트)
  $ factory init my-project --preset saas --theme default  # 프롬프트 없이 바로 생성

--preset과 --theme을 둘 다 지정하면 프롬프트 없이 바로 생성됩니다.`)
  .action(init)

program
  .command('add')
  .description('Add a module to an existing project')
  .argument('<module>', 'Module name (seo, analytics, ads, security, auth, db, payments)')
  .addHelpText('after', `
Examples:
  $ factory add payments                             # 결제 모듈 추가
  $ factory add auth                                 # 인증 모듈 추가 (db 의존성 자동 해결)`)
  .action(add)

program
  .command('remove')
  .description('Remove a module from an existing project')
  .argument('<module>', 'Module name to remove')
  .addHelpText('after', `
Examples:
  $ factory remove ads                               # 광고 모듈 제거
  $ factory remove analytics                         # 애널리틱스 모듈 제거`)
  .action(remove)

program.parse()
