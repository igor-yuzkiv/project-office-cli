import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { Project } from '@/entities/project/types'
import type { ProjectRepositoryDefinition } from '@/shared/libs/project-office'

function buildProjectProperties(project: Project): MarkdownProperties {
    return {
        prefix: project.prefix,
        status: project.status,
        start_date: project.start_date,
        end_date: project.end_date,
        tags: project.tags?.map((tag) => tag.name) ?? [],
        created_at: project.created_at,
        updated_at: project.updated_at,
    }
}

function buildProjectContent(project: Project, repos: ProjectRepositoryDefinition[]): string {
    const base = `# ${project.name}\n\n${project.description ?? ''}`
    if (repos.length === 0) {
        return base
    }

    const reposList = repos.map((repo) => `- ${repo.name} (${repo.path})`).join('\n')
    return `${base}\n\n## Repositories\n\n${reposList}`
}

export function renderProjectAsMarkdown(project: Project, repos: ProjectRepositoryDefinition[] = []): string {
    return renderMarkdown(buildProjectContent(project, repos), buildProjectProperties(project))
}
