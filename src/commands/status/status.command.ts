import { Command } from 'commander'

import { buildStatusReport } from '@/commands/status/status.service'
import type { StatusReport } from '@/commands/status/status.type'
import { renderJson, renderMarkdown, type CliOutputFormat } from '@/shared/libs/output'
import { DEFAULT_OUTPUT_FORMAT } from '@/shared/config'

type StatusCommandOptions = {
    format: CliOutputFormat
}

function checklistLine(done: boolean, label: string): string {
    return `- [${done ? 'x' : ' '}] ${label}`
}

function renderStatusAsMarkdown(report: StatusReport): string {
    const checklist = [
        checklistLine(report.cli.installed, 'CLI installed'),
        checklistLine(report.repo.linked, 'Repo linked to a project'),
        checklistLine(report.server.reachable, 'Server reachable'),
        checklistLine(report.server.authenticated, 'Server authenticated'),
    ].join('\n')

    const issuesSection = report.issues.length
        ? `\n\n## Issues\n\n${report.issues.map((issue) => `- ${issue}`).join('\n')}`
        : ''

    const content = `${checklist}${issuesSection}`

    return renderMarkdown(content, {
        installed: report.cli.installed,
        linked: report.repo.linked,
        project_id: report.repo.linked ? report.repo.projectId : null,
        project: report.project?.name ?? null,
        server_reachable: report.server.reachable,
        server_authenticated: report.server.authenticated,
        ready: report.ready,
    })
}

export const statusCommand = new Command('status')
    .description(
        'Reports agent context and readiness: CLI install state, server reachability, and repo-project link. Never fails — always exits 0.'
    )
    .option('-f, --format <format>', 'Output format (json|markdown)', DEFAULT_OUTPUT_FORMAT)
    .action(async (options: StatusCommandOptions) => {
        const report = await buildStatusReport()

        if (options.format === 'markdown') {
            console.log(renderStatusAsMarkdown(report))
            return
        }

        console.log(renderJson(report))
    })
