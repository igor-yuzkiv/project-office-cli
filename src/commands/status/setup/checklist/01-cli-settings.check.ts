import type { StatusCheckResult } from '@/commands/status/status.type'
import { SETTINGS_FILE } from '@/shared/config'
import { cliSettingsProvider } from '@/shared/libs/settings'

export async function checkCliSettings(): Promise<StatusCheckResult> {
    try {
        const settings = await cliSettingsProvider.readRawSettings()
        cliSettingsProvider.assertValid(settings)
    } catch (error) {
        return { passed: false, messages: [error instanceof Error ? error.message : String(error)] }
    }

    return { passed: true, messages: ['Settings file found and valid.', `File: ${SETTINGS_FILE}`] }
}
