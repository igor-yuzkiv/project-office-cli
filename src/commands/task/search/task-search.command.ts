import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { searchTasksRequest, renderTaskListAsMarkdown } from '@/entities/task'
import type { TaskInclude, TaskSearchParams } from '@/entities/task'
import type { SortDirection } from '@/shared/types'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskSearchCommandOptions = {
    format: CliOutputFormat
    query?: string
    page?: string
    perPage?: string
    sortBy?: string
    sortOrder?: SortDirection
    include?: string
}

export const taskSearchCommand = new Command('task:search')
    .description('Searches tasks in the current Project Office project.')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .option('-q, --query <query>', 'Search query')
    .option('--page <page>', 'Page number')
    .option('--per-page <perPage>', 'Items per page')
    .option('--sort-by <field>', 'Field to sort by')
    .option('--sort-order <order>', 'Sort order (asc|desc)')
    .option('--include <fields>', 'Comma-separated related data to include')
    .action(async (options: TaskSearchCommandOptions) => {
        const projectId = projectOfficeContextProvider.getProjectId()

        const params: TaskSearchParams = {
            query: options.query,
            page: options.page ? Number(options.page) : undefined,
            per_page: options.perPage ? Number(options.perPage) : undefined,
            sort_by: options.sortBy,
            sort_order: options.sortOrder,
            include: options.include?.split(',') as TaskInclude[] | undefined,
        }
        const response = await searchTasksRequest(projectId, params)

        if (options.format === 'markdown') {
            console.log(renderTaskListAsMarkdown(response))
            return
        }

        console.log(renderJson(response))
    })
