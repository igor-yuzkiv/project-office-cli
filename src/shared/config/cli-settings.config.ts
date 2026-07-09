import { homedir } from 'node:os'
import { join } from 'node:path'

import type { CliSettings, CliSettingsDefinition } from '@/shared/libs/settings/cli-settings.type'

const CACHE_DIR_NAME = '.project-office-cache'
const SETTINGS_FILE_NAME = 'settings.json'

export const SETTINGS_DIR = join(homedir(), CACHE_DIR_NAME)
export const SETTINGS_FILE = join(SETTINGS_DIR, SETTINGS_FILE_NAME)

const DEFAULT_BACKEND_USER_PROFILE_PATH = '/#/profile'
const DEFAULT_BACKEND_BASE_URL = 'http://127.0.0.1:8000'
const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000/api/cli/'

export function cliSettingsDefinition(values: Partial<CliSettings> = {}): CliSettingsDefinition {
    return {
        backendBaseUrl: {
            label: 'Backend Base URL',
            prompt: () => 'Backend base URL',
            value: values.backendBaseUrl ?? DEFAULT_BACKEND_BASE_URL,
            required: true,
        },
        backendUserProfilePath: {
            label: 'Backend User Profile Path',
            prompt: () => 'Backend user-profile path (used to build the token-creation link)',
            value: values.backendUserProfilePath ?? DEFAULT_BACKEND_USER_PROFILE_PATH,
            required: true,
        },
        apiBaseUrl: {
            label: 'API Base URL',
            prompt: () => 'Backend API base URL used for all CLI requests',
            value: values.apiBaseUrl ?? DEFAULT_API_BASE_URL,
            required: true,
        },
        apiToken: {
            label: 'API Token',
            prompt: (collected: Partial<CliSettings> = {}) =>
                `Enter your Project Office API token. Create one here: ${collected.backendBaseUrl}${collected.backendUserProfilePath}`,
            password: true,
            required: true,
        },
    }
}
