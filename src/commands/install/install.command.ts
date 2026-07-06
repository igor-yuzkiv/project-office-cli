import { existsSync } from 'node:fs'

import { Command } from 'commander'

import { SETTINGS_FILE, cliSettingsProvider, cliSettingsSetupService } from '@/shared/libs/settings'

export const installCommand = new Command('install')
    .description('Install the Project Office CLI and set up per-user settings')
    .action(async () => {
        const missingBackendEnvVars = (['BACKEND_BASE_URL', 'BACKEND_USER_PROFILE_PATH'] as const).filter(
            (name) => !Bun.env[name]
        )

        if (missingBackendEnvVars.length > 0) {
            console.error(`Missing required environment variable(s): ${missingBackendEnvVars.join(', ')}.`)
            process.exitCode = 1
            return
        }

        if (existsSync(SETTINGS_FILE)) {
            console.error('Project Office CLI is already installed.')
            process.exitCode = 1
            return
        }

        const settings = await cliSettingsSetupService.collect()
        await cliSettingsProvider.save(settings)

        console.log('Project Office CLI installed.')
    })
