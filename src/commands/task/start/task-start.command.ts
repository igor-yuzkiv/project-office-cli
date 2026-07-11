import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { startTaskRequest, renderStartTaskAsMarkdown } from '@/entities/task'
import type { StartTaskInput } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskStartCommandOptions = {
    format: CliOutputFormat
    task: string
    comment?: string
}

export const taskStartCommand = new Command('task:start')
    .description('Marks a task as started (in_progress) and prints its context with recent comments.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .option('--comment <comment>', 'Optional comment to record on start (inline, @file, or - for stdin)')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskStartCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const input: StartTaskInput = {
            comment: options.comment !== undefined ? await resolveTextInput(options.comment) : undefined,
        }
        const response = await startTaskRequest(projectId, options.task, input)

        if (options.format === 'markdown') {
            console.log(renderStartTaskAsMarkdown(response))
            return
        }

        console.log(renderJson(response))
    })
