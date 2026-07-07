import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { fetchTaskRequest, renderTaskAsMarkdown } from '@/entities/task'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type TaskViewCommandOptions = {
    format: CliOutputFormat
    task: string
}

export const taskViewCommand = new Command('task:view')
    .description('Shows details of a task in the current Project Office project.')
    .requiredOption('-t, --task <task>', 'Task ULID or key')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: TaskViewCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const response = await fetchTaskRequest(projectId, options.task)

        if (options.format === 'markdown') {
            console.log(renderTaskAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
