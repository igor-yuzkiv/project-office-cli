import { input, password } from '@inquirer/prompts'

import type { CliSettings } from '@/shared/libs/settings/cli-settings.type'
import { cliSettingsSetupDefinition } from '@/shared/config'

class CliSettingsSetupService {
    async collect(): Promise<CliSettings> {
        const collected: Partial<CliSettings> = {}

        for (const key of Object.keys(cliSettingsSetupDefinition) as (keyof CliSettings)[]) {
            const definition = cliSettingsSetupDefinition[key]
            collected[key] = definition.password
                ? await password({ message: definition.prompt, mask: true })
                : await input({ message: definition.prompt })
        }

        return collected as CliSettings
    }
}

export const cliSettingsSetupService = new CliSettingsSetupService()
