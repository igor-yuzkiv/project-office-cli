import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { Project } from '@/entities/project/types'
import type { ProjectRepositoryDefinition } from '@/shared/libs/project-office'
import { EMPTY_DESCRIPTION_PLACEHOLDER } from '@/shared/config'

function buildProjectProperties(project: Project): MarkdownProperties {
    return {
        id: project.id,
        prefix: project.prefix,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        tags: project.tags?.map((tag) => tag.name) ?? [],
        created_at: project.created_at,
        updated_at: project.updated_at,
    }
}

function buildProjectContent(
    project: Project,
    repos: ProjectRepositoryDefinition[],
    currentRepo?: ProjectRepositoryDefinition
): string {
    let content = `# ${project.name}\n\n${project.description || EMPTY_DESCRIPTION_PLACEHOLDER}`

    if (currentRepo) {
        content += `\n\n## Current repository\n\n- ${currentRepo.name} (${currentRepo.path})`
    }

    if (repos.length > 0) {
        const reposList = repos
            .map((repo) => `- ${repo.name} (${repo.path})${repo.path === currentRepo?.path ? ' (this repo)' : ''}`)
            .join('\n')
        content += `\n\n## Repositories\n\n${reposList}`
    }

    return content
}

export function renderProjectAsMarkdown(
    project: Project,
    repos: ProjectRepositoryDefinition[] = [],
    currentRepo?: ProjectRepositoryDefinition
): string {
    return renderMarkdown(buildProjectContent(project, repos, currentRepo), buildProjectProperties(project))
}
