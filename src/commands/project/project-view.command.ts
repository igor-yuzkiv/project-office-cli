import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { fetchProjectRequest, renderProjectAsMarkdown } from '@/entities/project'
import type { ProjectInclude } from '@/entities/project'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type ProjectViewCommandOptions = {
    format: CliOutputFormat
    include?: string
}

export const projectViewCommand = new Command('project:view')
    .description('Shows details of the current Project Office project.')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .option('--include <fields>', 'Comma-separated related data to include')
    .action(async (options: ProjectViewCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const include = options.include?.split(',') as ProjectInclude[] | undefined
        const response = await fetchProjectRequest(projectId, { include })

        if (options.format === 'markdown') {
            console.log(renderProjectAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
