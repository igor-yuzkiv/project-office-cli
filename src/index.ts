import { Command } from 'commander'

import { debugCommand } from '@/commands/debug'
import { installCommand } from '@/commands/install'
import { cliSettingsProvider } from '@/shared/libs/settings'
import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { projectViewCommand } from '@/commands/project'
import {
    taskListCommand,
    taskSearchCommand,
    taskViewCommand,
    taskCommentsCommand,
    taskCreateCommand,
    taskUpdateCommand,
    taskCommentAddCommand,
    taskCommentUpdateCommand,
} from '@/commands/task'
import { instructionsCommand } from '@/commands/instructions'

await cliSettingsProvider.bootstrap()
await projectOfficeContextProvider.bootstrap()

const program = new Command()

program.name('project-office').description('Agent-facing CLI for the Project Office / MVP Task Manager')

program.addCommand(debugCommand)
program.addCommand(installCommand)
program.addCommand(projectViewCommand)
program.addCommand(taskListCommand)
program.addCommand(taskSearchCommand)
program.addCommand(taskViewCommand)
program.addCommand(taskCommentsCommand)
program.addCommand(taskCreateCommand)
program.addCommand(taskUpdateCommand)
program.addCommand(taskCommentAddCommand)
program.addCommand(taskCommentUpdateCommand)
program.addCommand(instructionsCommand)

await program.parseAsync()
