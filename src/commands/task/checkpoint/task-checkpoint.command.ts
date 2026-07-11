import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { checkpointTaskRequest, renderTaskCommentAsMarkdown } from '@/entities/task'
import type { CheckpointTaskInput } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskCheckpointCommandOptions = {
    format: CliOutputFormat
    task: string
    subject: string
    comment: string
}

export const taskCheckpointCommand = new Command('task:checkpoint')
    .description('Records an intermediate checkpoint comment on a task. Does not change task status.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .requiredOption('--subject <subject>', 'Short checkpoint subject')
    .requiredOption('--comment <comment>', 'Checkpoint details (inline, @file, or - for stdin)')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskCheckpointCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const comment = await resolveTextInput(options.comment)
        const input: CheckpointTaskInput = { subject: options.subject, comment }
        const response = await checkpointTaskRequest(projectId, options.task, input)

        if (options.format === 'markdown') {
            console.log(renderTaskCommentAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
