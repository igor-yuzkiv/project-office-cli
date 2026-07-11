import { Command } from 'commander'

import { installCommand } from '@/commands/install'
import { cliSettingsProvider } from '@/shared/libs/settings'
import { selectedProjectContext } from '@/shared/libs/project-office'
import { projectViewCommand, projectConnectCommand, projectLinkRepoCommand } from '@/commands/project'
import {
    taskListCommand,
    taskViewCommand,
    taskCommentsCommand,
    taskCreateCommand,
    taskUpdateCommand,
    taskCommentAddCommand,
    taskCommentUpdateCommand,
    taskStartCommand,
    taskCheckpointCommand,
    taskHandoffCommand,
} from '@/commands/task'
import { docViewCommand, docCreateCommand, docUpdateCommand } from '@/commands/doc'
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
program.addCommand(taskViewCommand)
program.addCommand(taskCommentsCommand)
program.addCommand(taskCreateCommand)
program.addCommand(taskUpdateCommand)
program.addCommand(taskCommentAddCommand)
program.addCommand(taskCommentUpdateCommand)
program.addCommand(taskStartCommand)
program.addCommand(taskCheckpointCommand)
program.addCommand(taskHandoffCommand)
program.addCommand(docViewCommand)
program.addCommand(docCreateCommand)
program.addCommand(docUpdateCommand)
program.addCommand(instructionsCommand)
program.addCommand(statusCommand)

await program.parseAsync()
