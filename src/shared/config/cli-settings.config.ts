import { homedir } from 'node:os'
import { join } from 'node:path'

import type { CliSettingsSetupDefinition } from '@/shared/libs/settings/cli-settings.type'

const CACHE_DIR_NAME = '.project-office-cache'
const SETTINGS_FILE_NAME = 'settings.json'

export const SETTINGS_DIR = join(homedir(), CACHE_DIR_NAME)
export const SETTINGS_FILE = join(SETTINGS_DIR, SETTINGS_FILE_NAME)

const DEFAULT_BACKEND_BASE_URL = 'https://task.igor-yuzkiv-dev.tech'
const DEFAULT_BACKEND_USER_PROFILE_PATH = '/#/profile'
const DEFAULT_API_BASE_URL = 'https://task.igor-yuzkiv-dev.tech/api/cli/'

export const cliSettingsSetupDefinition: CliSettingsSetupDefinition = {
    backendBaseUrl: {
        label: 'Backend Base URL',
        prompt: 'Backend base URL',
        value: DEFAULT_BACKEND_BASE_URL,
    },
    backendUserProfilePath: {
        label: 'Backend User Profile Path',
        prompt: 'Backend user-profile path (used to build the token-creation link)',
        value: DEFAULT_BACKEND_USER_PROFILE_PATH,
    },
    apiBaseUrl: {
        label: 'API Base URL',
        prompt: 'Backend API base URL used for all CLI requests',
        value: DEFAULT_API_BASE_URL,
    },
    apiToken: {
        label: 'API Token',
        // Overridden at collection time in cliSettingsSetupService — the token-creation URL
        // reflects the backendBaseUrl/backendUserProfilePath the user just entered, not this
        // fallback (used only if apiToken were ever collected outside that flow).
        prompt: `Enter your Project Office API token. Create one here: ${DEFAULT_BACKEND_BASE_URL}${DEFAULT_BACKEND_USER_PROFILE_PATH}`,
        password: true,
    },
}
