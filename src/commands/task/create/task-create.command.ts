import { Command } from 'commander'

import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { createTaskRequest, renderTaskAsMarkdown, resolveTaskPriority } from '@/entities/task'
import type { CreateTaskInput, TaskPriorityValue } from '@/entities/task'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskCreateCommandOptions = {
    format: CliOutputFormat
    name: string
    description?: string
    priority?: string
    startDate?: string
    dueDate?: string
    taskList?: string
    tag: string[]
}

function collectTag(value: string, previous: string[]): string[] {
    return [...previous, value]
}

export const taskCreateCommand = new Command('task:create')
    .description('Creates a task in the current Project Office project.')
    .requiredOption('--name <name>', 'Task name')
    .option('--description <description>', 'Task description (inline, @file, or - for stdin)')
    .option('--priority <priority>', 'Priority: none|low|medium|high|urgent')
    .option('--start-date <date>', 'Start date')
    .option('--due-date <date>', 'Due date')
    .option('--task-list <taskListId>', 'Task list id')
    .option('--tag <tagId>', 'Tag id (repeatable)', collectTag, [] as string[])
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskCreateCommandOptions) => {
        let priority: TaskPriorityValue | undefined
        try {
            priority = options.priority ? resolveTaskPriority(options.priority) : undefined
        } catch (error) {
            console.error(error instanceof Error ? error.message : String(error))
            process.exitCode = 1
            return
        }

        const projectId = projectOfficeContextProvider.getProjectId()

        const input: CreateTaskInput = {
            name: options.name,
            task_list_id: options.taskList,
            description: options.description ? await resolveTextInput(options.description) : undefined,
            priority,
            start_date: options.startDate,
            due_date: options.dueDate,
            tag_ids: options.tag.length > 0 ? options.tag : undefined,
        }
        const response = await createTaskRequest(projectId, input)

        if (options.format === 'markdown') {
            console.log(renderTaskAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
