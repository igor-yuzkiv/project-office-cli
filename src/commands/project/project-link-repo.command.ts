import { resolve } from 'node:path'

import { Command } from 'commander'

import { fetchProjectRequest } from '@/entities/project'
import { projectsRegister } from '@/shared/libs/project-office'
import type { ProjectRepositoryDefinition } from '@/shared/libs/project-office'
import { renderJson, renderMarkdown, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type ProjectLinkRepoCommandOptions = {
    format: CliOutputFormat
    project: string
    path: string
    name: string
    description?: string
    stack: string[]
}

function collectStack(value: string, previous: string[]): string[] {
    return [...previous, value]
}

export const projectLinkRepoCommand = new Command('project:link-repo')
    .description(
        'Links the current repository to a Project Office project: ensures its cache file exists, ' +
            'records the repo in it, and writes <repo>/.project-office/repo-settings.json.'
    )
    .requiredOption('--project <id>', 'Project id')
    .requiredOption('--name <name>', 'Repo name')
    .option('--path <dir>', 'Repo directory to link (default: current directory)', process.cwd())
    .option('--description <description>', 'Repo description')
    .option('--stack <tech>', 'Repo stack entry (repeatable)', collectStack, [] as string[])
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: ProjectLinkRepoCommandOptions) => {
        const repoPath = resolve(options.path)

        if (!(await projectsRegister.getProjectRecord(options.project))) {
            const response = await fetchProjectRequest(options.project)
            await projectsRegister.setProjectRecord(options.project, response.data)
        }

        const repositoryLink: ProjectRepositoryDefinition = {
            projectId: options.project,
            path: repoPath,
            name: options.name,
            description: options.description,
            stack: options.stack.length > 0 ? options.stack : undefined,
        }
        await projectsRegister.linkRepositoryToProject(options.project, repositoryLink)
        await projectsRegister.writeRepositorySettings(repoPath, repositoryLink)

        const result = { projectId: options.project, repoPath }

        if (options.format === 'markdown') {
            console.log(renderMarkdown(`# Repo linked\n\nLinked ${repoPath} to project ${options.project}.`, result))
            return
        }

        console.log(renderJson(result))
    })
