import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { createDocumentRequest, renderDocumentAsMarkdown } from '@/entities/document'
import type { CreateDocumentInput } from '@/entities/document'
import { resolveTextInput } from '@/shared/utils'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type DocCreateCommandOptions = {
    format: CliOutputFormat
    title: string
    content?: string
    tags?: string
}

export const docCreateCommand = new Command('doc:create')
    .description('Creates a root document in the current Project Office project.')
    .requiredOption('--title <title>', 'Document title')
    .option('--content <content>', 'Document content (inline, @file, or - for stdin)')
    .option('--tags <tags>', 'Comma-separated tag names (e.g. "architecture,backend")')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: DocCreateCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const input: CreateDocumentInput = {
            title: options.title,
            content: options.content ? await resolveTextInput(options.content) : undefined,
            tags: options.tags,
        }
        const response = await createDocumentRequest(projectId, input)

        if (options.format === 'markdown') {
            console.log(renderDocumentAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
