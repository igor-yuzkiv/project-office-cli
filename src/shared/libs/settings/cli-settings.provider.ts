import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname } from 'node:path'

import type { CliSettings } from '@/shared/libs/settings/cli-settings.type'
import { SETTINGS_FILE } from '@/shared/libs/settings/cli-settings.const'

class CliSettingsProvider {
    private settings: CliSettings | null = null

    async save(settings: CliSettings): Promise<void> {
        await mkdir(dirname(SETTINGS_FILE), { recursive: true })
        await writeFile(SETTINGS_FILE, `${JSON.stringify(settings, null, 4)}\n`, { mode: 0o600 })
        this.settings = settings
    }

    async load(): Promise<CliSettings> {
        if (!existsSync(SETTINGS_FILE)) {
            throw new Error('Project Office CLI is not installed — run `project-office install` first.')
        }

        const raw = await Bun.file(SETTINGS_FILE).text()

        let parsed: unknown
        try {
            parsed = JSON.parse(raw)
        } catch {
            throw new Error(
                `Failed to parse ${SETTINGS_FILE} — it may be corrupted. Try running \`project-office install\` again.`
            )
        }

        if (parsed === null || typeof parsed !== 'object') {
            throw new Error(
                `Failed to parse ${SETTINGS_FILE} — it may be corrupted. Try running \`project-office install\` again.`
            )
        }

        const settings = parsed as CliSettings
        if (typeof settings.apiToken !== 'string' || settings.apiToken.length === 0) {
            throw new Error(
                `${SETTINGS_FILE} is missing a valid apiToken. Try running \`project-office install\` again.`
            )
        }

        this.settings = settings
        return this.settings
    }

    async bootstrap(): Promise<CliSettings | null> {
        try {
            return await this.load()
        } catch (error) {
            console.error(error instanceof Error ? error.message : String(error))
            return null
        }
    }

    get<K extends keyof CliSettings>(key: K): CliSettings[K] {
        if (!this.settings) {
            throw new Error('CLI settings are not loaded — call load() first.')
        }

        return this.settings[key]
    }

    getAll(): CliSettings {
        if (!this.settings) {
            throw new Error('CLI settings are not loaded — call load() first.')
        }

        return this.settings
    }
}

export const cliSettingsProvider = new CliSettingsProvider()
