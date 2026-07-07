import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { createTaskCommentsRequest, renderCreatedTaskCommentsAsMarkdown } from '@/entities/task'
import type { CreateTaskCommentsInput } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskCommentAddCommandOptions = {
    format: CliOutputFormat
    task: string
    content: string
}

export const taskCommentAddCommand = new Command('task:comment-add')
    .description('Adds a comment to a task in the current Project Office project.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .requiredOption('--content <content>', 'Comment content (inline, @file, or - for stdin)')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskCommentAddCommandOptions) => {
        const projectId = projectOfficeContextProvider.getProjectId()

        const content = await resolveTextInput(options.content)
        const input: CreateTaskCommentsInput = { comments: [{ content }] }
        const response = await createTaskCommentsRequest(projectId, options.task, input)

        if (options.format === 'markdown') {
            console.log(renderCreatedTaskCommentsAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
