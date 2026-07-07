import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { updateTaskCommentRequest, renderTaskCommentAsMarkdown } from '@/entities/task'
import type { UpdateTaskCommentInput } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskCommentUpdateCommandOptions = {
    format: CliOutputFormat
    task: string
    comment: string
    content: string
}

export const taskCommentUpdateCommand = new Command('task:comment-update')
    .description('Updates a comment on a task in the current Project Office project.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .requiredOption('--comment <comment>', 'Comment id')
    .requiredOption('--content <content>', 'Comment content (inline, @file, or - for stdin)')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskCommentUpdateCommandOptions) => {
        if (!/^\d+$/.test(options.comment)) {
            console.error(`Invalid --comment "${options.comment}" — expected a numeric comment id.`)
            process.exitCode = 1
            return
        }

        const projectId = projectOfficeContextProvider.getProjectId()

        const content = await resolveTextInput(options.content)
        const input: UpdateTaskCommentInput = { content }
        const response = await updateTaskCommentRequest(projectId, options.task, options.comment, input)

        if (options.format === 'markdown') {
            console.log(renderTaskCommentAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
