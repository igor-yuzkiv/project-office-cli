import { join } from 'node:path'

import { SETTINGS_DIR } from '@/shared/config/cli-settings.config'

export const PROJECT_OFFICE_REPO_DIR = '.project-office'
export const PROJECT_OFFICE_REPO_SETTINGS_FILE = 'repo-settings.json'

export const PROJECT_OFFICE_PROJECTS_CACHE_DIR = join(SETTINGS_DIR, 'projects')
