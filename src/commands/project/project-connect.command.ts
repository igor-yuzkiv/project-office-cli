import { Command } from 'commander'

import { fetchProjectRequest, renderProjectAsMarkdown } from '@/entities/project'
import { projectsRegister } from '@/shared/libs/project-office'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type ProjectConnectCommandOptions = {
    format: CliOutputFormat
    project: string
}

export const projectConnectCommand = new Command('project:connect')
    .description('Fetches a project and creates/updates its local cache file. Does not write repo-settings.json.')
    .requiredOption('--project <id>', 'Project id')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: ProjectConnectCommandOptions) => {
        const response = await fetchProjectRequest(options.project)
        await projectsRegister.setProjectRecord(options.project, response.data)

        if (options.format === 'markdown') {
            console.log(renderProjectAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
