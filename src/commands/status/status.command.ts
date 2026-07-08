import { Command } from 'commander'

import { checklist } from '@/commands/status/setup/checklist'
import type { StatusCheckResult, StatusCommandOptions } from '@/commands/status/status.type'
import { renderJson, renderMarkdown } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

function renderCheckAsText(title: string, result: StatusCheckResult): string {
    const marker = result.passed ? 'X' : ' '
    const detailLines = result.messages.map((message) => `    ${message}`)
    return [`[${marker}] ${title}`, ...detailLines].join('\n')
}

export const statusCommand = new Command('status')
    .description(
        'Reports a preflight checklist of CLI / Project Office readiness: CLI settings, repository link, ' +
            'server connection, authentication, and project access. Never fails — always exits 0.'
    )
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: StatusCommandOptions) => {
        const results: Array<{ title: string; result: StatusCheckResult }> = []

        for (const { title, run } of checklist) {
            results.push({ title, result: await run() })
        }

        const ready = results.every(({ result }) => result.passed)

        if (options.format === 'json') {
            console.log(
                renderJson({
                    checks: results.map(({ title, result }) => ({ title, ...result })),
                    result: ready ? 'ready' : 'failed',
                })
            )
            return
        }

        const content = [
            'Project Office status',
            ...results.map(({ title, result }) => renderCheckAsText(title, result)),
            `Result: ${ready ? 'ready' : 'failed'}`,
        ].join('\n\n')

        console.log(renderMarkdown(content, {}))
    })
