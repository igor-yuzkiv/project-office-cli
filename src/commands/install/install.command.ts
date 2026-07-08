import { mkdir } from 'node:fs/promises'

import { input, password } from '@inquirer/prompts'
import { Command } from 'commander'

import type { CliSettings } from '@/shared/libs/settings'
import { PROJECT_OFFICE_PROJECTS_CACHE_DIR, cliSettingsDefinition } from '@/shared/config'
import { cliSettingsProvider } from '@/shared/libs/settings'

export const installCommand = new Command('install')
    .description('Install the Project Office CLI and set up per-user settings')
    .action(async () => {
        try {
            const settings = await collectSettings()
            cliSettingsProvider.assertValid(settings)

            await cliSettingsProvider.save(settings)
            await mkdir(PROJECT_OFFICE_PROJECTS_CACHE_DIR, { recursive: true })

            console.log('Project Office CLI installed.')
        } catch (error) {
            console.error(error instanceof Error ? error.message : String(error))
            process.exitCode = 1
        }
    })

async function collectSettings(): Promise<CliSettings> {
    const definition = cliSettingsDefinition(cliSettingsProvider.isLoaded() ? cliSettingsProvider.getAll() : {})
    const collected: Partial<CliSettings> = {}

    for (const key of Object.keys(definition) as (keyof CliSettings)[]) {
        const item = definition[key]
        const prompt = item.prompt(collected)

        collected[key] = item.password
            ? await password({ message: prompt, mask: true })
            : await input({ message: prompt, default: item.value })
    }

    return collected as CliSettings
}
