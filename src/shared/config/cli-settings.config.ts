import { homedir } from 'node:os'
import { join } from 'node:path'

import type { CliSettingsSetupDefinition } from '@/shared/libs/settings/cli-settings.type'

const cacheDir = Bun.env.PROJECT_OFFICE_CACHE_DIR ?? '.project-office-cache'
const settingsFile = Bun.env.PROJECT_OFFICE_SETTINGS_FILE ?? 'settings.json'

export const SETTINGS_DIR = join(homedir(), cacheDir)
export const SETTINGS_FILE = join(SETTINGS_DIR, settingsFile)

export const cliSettingsSetupDefinition: CliSettingsSetupDefinition = {
    apiToken: {
        label: 'API Token',
        prompt: `Enter your Project Office API token. Create one here: ${Bun.env.BACKEND_BASE_URL}${Bun.env.BACKEND_USER_PROFILE_PATH}`,
        password: true,
    },
}
