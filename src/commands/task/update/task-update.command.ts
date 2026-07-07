import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { updateTaskRequest, renderTaskAsMarkdown } from '@/entities/task'
import type { UpdateTaskInput, TaskStatus } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskUpdateCommandOptions = {
    format: CliOutputFormat
    task: string
    status?: TaskStatus
    description?: string
}

export const taskUpdateCommand = new Command('task:update')
    .description('Updates a task in the current Project Office project. Only status and description can be changed.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .option('--status <status>', 'Status: open|in_progress|completed|closed')
    .option('--description <description>', 'Task description (inline, @file, or - for stdin)')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskUpdateCommandOptions) => {
        if (!options.status && options.description === undefined) {
            console.error('task:update requires at least one of --status or --description.')
            process.exitCode = 1
            return
        }

        const projectId = projectOfficeContextProvider.getProjectId()

        const input: UpdateTaskInput = {
            status: options.status,
            description: options.description !== undefined ? await resolveTextInput(options.description) : undefined,
        }
        const response = await updateTaskRequest(projectId, options.task, input)

        if (options.format === 'markdown') {
            console.log(renderTaskAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
