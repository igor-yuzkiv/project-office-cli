export type CliOutputFormat = 'json' | 'markdown'

export type MarkdownPropertyValue = string | number | boolean | null | Array<string | number>

export type MarkdownProperties = Record<string, MarkdownPropertyValue>
