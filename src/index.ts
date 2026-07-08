import { Command } from 'commander'

import { installCommand } from '@/commands/install'
import { cliSettingsProvider } from '@/shared/libs/settings'
import { selectedProjectContext } from '@/shared/libs/project-office'
import { projectViewCommand, projectConnectCommand, projectLinkRepoCommand } from '@/commands/project'
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
import { statusCommand } from '@/commands/status'

await cliSettingsProvider.bootstrap()
await selectedProjectContext.bootstrap()

const program = new Command()

program.name('project-office').description('Agent-facing CLI for the Project Office / MVP Task Manager')

program.addCommand(installCommand)
program.addCommand(projectViewCommand)
program.addCommand(projectConnectCommand)
program.addCommand(projectLinkRepoCommand)
program.addCommand(taskListCommand)
program.addCommand(taskSearchCommand)
program.addCommand(taskViewCommand)
program.addCommand(taskCommentsCommand)
program.addCommand(taskCreateCommand)
program.addCommand(taskUpdateCommand)
program.addCommand(taskCommentAddCommand)
program.addCommand(taskCommentUpdateCommand)
program.addCommand(instructionsCommand)
program.addCommand(statusCommand)

await program.parseAsync()
