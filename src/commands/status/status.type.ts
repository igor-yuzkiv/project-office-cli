import type { CliOutputFormat } from '@/shared/libs/output'

export type StatusCommandOptions = {
    format: CliOutputFormat
}

export interface StatusCheckResult {
    passed: boolean
    messages: string[]
}

export interface StatusCheckDefinition {
    title: string
    run: () => Promise<StatusCheckResult>
}
