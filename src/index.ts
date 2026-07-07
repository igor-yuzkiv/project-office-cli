import { Command } from 'commander'

import { debugCommand } from '@/commands/debug'
import { installCommand } from '@/commands/install'
import { cliSettingsProvider } from '@/shared/libs/settings'
import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { projectShowCommand } from '@/commands/project/project-show.command.ts'

await cliSettingsProvider.bootstrap()
await projectOfficeContextProvider.bootstrap()

const program = new Command()

program.name('project-office').description('Agent-facing CLI for the Project Office / MVP Task Manager')

program.addCommand(debugCommand)
program.addCommand(installCommand)
program.addCommand(projectShowCommand)

await program.parseAsync()
