import { existsSync } from 'node:fs'
import { mkdir } from 'node:fs/promises'

import { Command } from 'commander'

import { SETTINGS_FILE, PROJECT_OFFICE_PROJECTS_CACHE_DIR } from '@/shared/config'
import { cliSettingsProvider, cliSettingsSetupService } from '@/shared/libs/settings'

export const installCommand = new Command('install')
    .description('Install the Project Office CLI and set up per-user settings')
    .action(async () => {
        if (existsSync(SETTINGS_FILE)) {
            console.error('Project Office CLI is already installed.')
            process.exitCode = 1
            return
        }

        const settings = await cliSettingsSetupService.collect()
        await cliSettingsProvider.save(settings)
        await mkdir(PROJECT_OFFICE_PROJECTS_CACHE_DIR, { recursive: true })

        console.log('Project Office CLI installed.')
    })
