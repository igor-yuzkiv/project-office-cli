import type { MarkdownProperties, MarkdownPropertyValue } from '@/shared/libs/output/output.type'

function renderPropertyValue(value: MarkdownPropertyValue): string {
    if (Array.isArray(value)) {
        return `[${value.join(', ')}]`
    }

    return String(value)
}

function renderFrontmatter(properties: MarkdownProperties): string {
    const lines = Object.entries(properties).map(([key, value]) => `${key}: ${renderPropertyValue(value)}`)

    return `---\n${lines.join('\n')}\n---`
}

export function renderMarkdown(content: string, properties: MarkdownProperties): string {
    if (Object.keys(properties).length === 0) {
        return content
    }

    return `${renderFrontmatter(properties)}\n\n${content}`
}
