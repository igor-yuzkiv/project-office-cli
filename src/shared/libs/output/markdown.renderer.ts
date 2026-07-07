import type { MarkdownProperties, MarkdownPropertyValue } from '@/shared/libs/output/output.type'

function quoteScalar(value: string | number | boolean): string {
    return `"${String(value).replace(/"/g, '\\"')}"`
}

function renderPropertyLine(key: string, value: MarkdownPropertyValue): string {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return `${key}: null`
        }

        const items = value.map((item) => `  - ${item}`)
        return `${key}:\n${items.join('\n')}`
    }

    if (value === null) {
        return `${key}: null`
    }

    return `${key}: ${quoteScalar(value)}`
}

function renderFrontmatter(properties: MarkdownProperties): string {
    const lines = Object.entries(properties).map(([key, value]) => renderPropertyLine(key, value))

    return `---\n${lines.join('\n')}\n---`
}

export function renderMarkdown(content: string, properties: MarkdownProperties): string {
    if (Object.keys(properties).length === 0) {
        return content
    }

    return `${renderFrontmatter(properties)}\n\n${content}`
}
