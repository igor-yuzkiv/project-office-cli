import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { handoffTaskRequest, renderTaskAsMarkdown } from '@/entities/task'
import type { HandoffTaskInput } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskHandoffCommandOptions = {
    format: CliOutputFormat
    task: string
    resolution: string
}

export const taskHandoffCommand = new Command('task:handoff')
    .description('Hands off a task to testing (status ready_to_test) with a resolution comment.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .requiredOption('--resolution <resolution>', 'Resolution summary (inline, @file, or - for stdin)')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskHandoffCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const resolution = await resolveTextInput(options.resolution)
        const input: HandoffTaskInput = { resolution }
        const response = await handoffTaskRequest(projectId, options.task, input)

        if (options.format === 'markdown') {
            console.log(renderTaskAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
