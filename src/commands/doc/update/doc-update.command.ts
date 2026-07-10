import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { updateDocumentRequest, renderDocumentAsMarkdown } from '@/entities/document'
import type { UpdateDocumentInput } from '@/entities/document'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type DocUpdateCommandOptions = {
    format: CliOutputFormat
    doc: string
    title?: string
    content?: string
    tags?: string
}

export const docUpdateCommand = new Command('doc:update')
    .description('Updates a document in the current Project Office project.')
    .requiredOption('-d, --doc <document>', 'Document ULID or key')
    .option('--title <title>', 'New document title')
    .option('--content <content>', 'Document content (inline, @file, or - for stdin)')
    .option('--tags <tags>', 'Comma-separated tag names (replaces all current tags, e.g. "architecture,backend")')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: DocUpdateCommandOptions) => {
        if (!options.title && options.content === undefined && options.tags === undefined) {
            console.error('doc:update requires at least one of --title, --content, or --tags.')
            process.exitCode = 1
            return
        }

        const projectId = selectedProjectContext.getProjectId()

        const input: UpdateDocumentInput = {
            title: options.title,
            content: options.content !== undefined ? await resolveTextInput(options.content) : undefined,
            tags: options.tags,
        }
        const response = await updateDocumentRequest(projectId, options.doc, input)

        if (options.format === 'markdown') {
            console.log(renderDocumentAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
