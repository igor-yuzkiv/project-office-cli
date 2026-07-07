import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { fetchTaskCommentsRequest, renderTaskCommentsAsMarkdown } from '@/entities/task'
import type { PagingParams } from '@/shared/types'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskCommentsCommandOptions = {
    format: CliOutputFormat
    task: string
    page?: string
    perPage?: string
}

export const taskCommentsCommand = new Command('task:comments')
    .description('Lists comments on a task in the current Project Office project.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .option('--page <page>', 'Page number')
    .option('--per-page <perPage>', 'Items per page')
    .action(async (options: TaskCommentsCommandOptions) => {
        const projectId = projectOfficeContextProvider.getProjectId()

        const params: PagingParams = {
            page: options.page ? Number(options.page) : undefined,
            per_page: options.perPage ? Number(options.perPage) : undefined,
        }
        const response = await fetchTaskCommentsRequest(projectId, options.task, params)

        if (options.format === 'markdown') {
            console.log(renderTaskCommentsAsMarkdown(response))
            return
        }

        console.log(renderJson(response))
    })
