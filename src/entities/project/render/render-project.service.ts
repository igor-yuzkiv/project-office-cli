import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { Project } from '@/entities/project/types'

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

function buildProjectContent(project: Project): string {
    return `# ${project.name}\n\n${project.description ?? ''}`
}

export function renderProjectAsMarkdown(project: Project): string {
    return renderMarkdown(buildProjectContent(project), buildProjectProperties(project))
}
