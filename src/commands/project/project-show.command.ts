import { Command } from 'commander'
import { projectOfficeContextProvider } from '@/shared/libs/project-office'
import { fetchProjectRequest } from '@/entities/project'
import type { CliOutputFormat } from '@/shared/types/output.type.ts'

type ProjectShowCommandOptions = {
    format?: CliOutputFormat
}

export const projectShowCommand = new Command('project:show')
    .description('Shows details of the current Project Office project.')
    .option('-f, --format <format>', 'Output format (json|markdown)')
    .action(async (options: ProjectShowCommandOptions) => {
        const projectId = projectOfficeContextProvider.getProjectId()

        const response = await fetchProjectRequest(projectId)

        if (options.format === 'markdown') {
            console.warn('not implemented yet')
            return;
        }

        console.log(JSON.stringify(response.data, null, 2))
        console.log(options.format)
    })
