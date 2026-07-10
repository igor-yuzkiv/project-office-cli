import { renderMarkdown } from '@/shared/libs/output'
import type { MarkdownProperties } from '@/shared/libs/output'
import type { Document } from '@/entities/document/types'
import { EMPTY_DESCRIPTION_PLACEHOLDER } from '@/shared/config'

function buildDocumentProperties(document: Document): MarkdownProperties {
    return {
        id: document.id,
        key: document.key,
        status: document.status,
        tags: document.tags.map((tag) => tag.name),
        path: document.path.map((node) => node.key),
    }
}

function buildDocumentContent(document: Document): string {
    return `# ${document.title}\n\n${document.content || EMPTY_DESCRIPTION_PLACEHOLDER}`
}

export function renderDocumentAsMarkdown(document: Document): string {
    return renderMarkdown(buildDocumentContent(document), buildDocumentProperties(document))
}
