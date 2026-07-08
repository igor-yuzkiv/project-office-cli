import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { createTaskRequest, renderTaskAsMarkdown } from '@/entities/task'
import type { CreateTaskInput } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskCreateCommandOptions = {
    format: CliOutputFormat
    name: string
    description?: string
    tags?: string
}

export const taskCreateCommand = new Command('task:create')
    .description('Creates a task in the current Project Office project.')
    .requiredOption('--name <name>', 'Task name')
    .option('--description <description>', 'Task description (inline, @file, or - for stdin)')
    .option('--tags <tags>', 'Comma-separated tag names (e.g. "bug,backend,urgent")')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskCreateCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const input: CreateTaskInput = {
            name: options.name,
            description: options.description ? await resolveTextInput(options.description) : undefined,
            tags: options.tags,
        }
        const response = await createTaskRequest(projectId, input)

        if (options.format === 'markdown') {
            console.log(renderTaskAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
