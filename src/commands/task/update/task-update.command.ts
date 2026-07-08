import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { updateTaskRequest, renderTaskAsMarkdown } from '@/entities/task'
import type { UpdateTaskInput, TaskStatus } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskUpdateCommandOptions = {
    format: CliOutputFormat
    task: string
    name?: string
    status?: TaskStatus
    description?: string
    tags?: string
}

export const taskUpdateCommand = new Command('task:update')
    .description('Updates a task in the current Project Office project.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .option('--name <name>', 'Task name')
    .option('--status <status>', 'Status: open|in_progress|completed|closed')
    .option('--description <description>', 'Task description (inline, @file, or - for stdin)')
    .option('--tags <tags>', 'Comma-separated tag names (replaces all current tags, e.g. "bug,backend,urgent")')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskUpdateCommandOptions) => {
        if (!options.name && !options.status && options.description === undefined && options.tags === undefined) {
            console.error('task:update requires at least one of --name, --status, --description, or --tags.')
            process.exitCode = 1
            return
        }

        const projectId = selectedProjectContext.getProjectId()

        const input: UpdateTaskInput = {
            name: options.name,
            status: options.status,
            description: options.description !== undefined ? await resolveTextInput(options.description) : undefined,
            tags: options.tags,
        }
        const response = await updateTaskRequest(projectId, options.task, input)

        if (options.format === 'markdown') {
            console.log(renderTaskAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
