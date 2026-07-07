import { input, password } from '@inquirer/prompts'

import type { CliSettings } from '@/shared/libs/settings/cli-settings.type'
import { cliSettingsSetupDefinition } from '@/shared/config'

class CliSettingsSetupService {
    async collect(): Promise<CliSettings> {
        const collected: Partial<CliSettings> = {}

        for (const key of Object.keys(cliSettingsSetupDefinition) as (keyof CliSettings)[]) {
            const definition = cliSettingsSetupDefinition[key]
            const prompt = key === 'apiToken' ? this.buildApiTokenPrompt(collected) : definition.prompt

            collected[key] = definition.password
                ? await password({ message: prompt, mask: true })
                : await input({ message: prompt, default: definition.value })
        }

        return collected as CliSettings
    }

    private buildApiTokenPrompt(collected: Partial<CliSettings>): string {
        const url = `${collected.backendBaseUrl}${collected.backendUserProfilePath}`
        return `Enter your Project Office API token. Create one here: ${url}`
    }
}

export const cliSettingsSetupService = new CliSettingsSetupService()
