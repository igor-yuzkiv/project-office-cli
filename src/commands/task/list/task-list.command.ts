import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { fetchTasksRequest, renderTaskListAsMarkdown } from '@/entities/task'
import type { TaskInclude, TaskFetchParams } from '@/entities/task'
import type { SortDirection } from '@/shared/types'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskListCommandOptions = {
    format: CliOutputFormat
    page?: string
    perPage?: string
    sortBy?: string
    sortOrder?: SortDirection
    include?: string
}

export const taskListCommand = new Command('task:list')
    .description('Lists tasks in the current Project Office project.')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .option('--page <page>', 'Page number')
    .option('--per-page <perPage>', 'Items per page')
    .option('--sort-by <field>', 'Field to sort by')
    .option('--sort-order <order>', 'Sort order (asc|desc)')
    .option('--include <fields>', 'Comma-separated related data to include')
    .action(async (options: TaskListCommandOptions) => {
        const projectId = projectOfficeContextProvider.getProjectId()

        const params: TaskFetchParams = {
            page: options.page ? Number(options.page) : undefined,
            per_page: options.perPage ? Number(options.perPage) : undefined,
            sort_by: options.sortBy,
            sort_order: options.sortOrder,
            include: options.include?.split(',') as TaskInclude[] | undefined,
        }
        const response = await fetchTasksRequest(projectId, params)

        if (options.format === 'markdown') {
            console.log(renderTaskListAsMarkdown(response))
            return
        }

        console.log(renderJson(response))
    })
