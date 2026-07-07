import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { PaginatedResponse } from '@/shared/types'
import type { TaskComment } from '@/entities/task/types'

function buildTaskCommentsProperties(response: PaginatedResponse<TaskComment>): MarkdownProperties {
    return {
        total: response.meta.total,
        page: response.meta.current_page,
        per_page: response.meta.per_page,
    }
}

function buildTaskCommentsContent(comments: TaskComment[]): string {
    return comments
        .map((comment) => `- **${comment.author.name}** (${comment.created_at}): ${comment.content}`)
        .join('\n')
}

export function renderTaskCommentsAsMarkdown(response: PaginatedResponse<TaskComment>): string {
    return renderMarkdown(buildTaskCommentsContent(response.data), buildTaskCommentsProperties(response))
}

function buildCommentProperties(comment: TaskComment): MarkdownProperties {
    return {
        id: comment.id,
        author: comment.author.name,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
    }
}

export function renderTaskCommentAsMarkdown(comment: TaskComment): string {
    return renderMarkdown(comment.content, buildCommentProperties(comment))
}

function buildCreatedCommentsProperties(comments: TaskComment[]): MarkdownProperties {
    return { count: comments.length }
}

export function renderCreatedTaskCommentsAsMarkdown(comments: TaskComment[]): string {
    return renderMarkdown(buildTaskCommentsContent(comments), buildCreatedCommentsProperties(comments))
}
