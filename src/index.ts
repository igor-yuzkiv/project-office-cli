import { Command } from 'commander'

import { debugCommand } from '@/commands/debug'
import { installCommand } from '@/commands/install'
import { cliSettingsProvider } from '@/shared/libs/settings'
import { projectOfficeContextProvider } from '@/shared/libs/project-office'

await cliSettingsProvider.bootstrap()
await projectOfficeContextProvider.bootstrap()

const program = new Command()

program.name('project-office').description('Agent-facing CLI for the Project Office / MVP Task Manager')

program.addCommand(installCommand)
program.addCommand(debugCommand)

await program.parseAsync()
