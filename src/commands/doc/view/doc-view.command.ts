import { Command } from 'commander'

import { selectedProjectContext } from '@/shared/libs/project-office'
import { fetchDocumentRequest, renderDocumentAsMarkdown } from '@/entities/document'
import { renderJson, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type DocViewCommandOptions = {
    format: CliOutputFormat
    doc: string
}

export const docViewCommand = new Command('doc:view')
    .description('Shows details of a document in the current Project Office project.')
    .requiredOption('-d, --doc <document>', 'Document ULID or key')
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: DocViewCommandOptions) => {
        const projectId = selectedProjectContext.getProjectId()

        const response = await fetchDocumentRequest(projectId, options.doc)

        if (options.format === 'markdown') {
            console.log(renderDocumentAsMarkdown(response.data))
            return
        }

        console.log(renderJson(response.data))
    })
