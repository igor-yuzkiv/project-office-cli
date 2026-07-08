import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname } from 'node:path'

import type { CliSettings, CliSettingsValidationError } from '@/shared/libs/settings/cli-settings.type'
import { SETTINGS_FILE, cliSettingsDefinition } from '@/shared/config'

class CliSettingsProvider {
    private settings: CliSettings | null = null

    async bootstrap(): Promise<CliSettings | null> {
        try {
            const settings = await this.readRawSettings()
            this.assertValid(settings)

            this.settings = settings
            return this.settings
        } catch (error) {
            console.error(error instanceof Error ? error.message : String(error))
            return null
        }
    }

    async readRawSettings(): Promise<Partial<CliSettings>> {
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

        return parsed as Partial<CliSettings>
    }

    assertValid(settings: Partial<CliSettings>): asserts settings is CliSettings {
        const errors = this.validate(settings)
        if (errors.length === 0) {
            return
        }

        const details = errors.map(({ key, message }) => `${key} → ${message}`).join('; ')
        throw new Error(`${SETTINGS_FILE} is invalid (${details}). Try running \`project-office install\` again.`)
    }

    validate(settings: Partial<CliSettings>): CliSettingsValidationError[] {
        const errors: CliSettingsValidationError[] = []
        const definitions = cliSettingsDefinition()

        for (const key of Object.keys(definitions) as (keyof CliSettings)[]) {
            const definition = definitions[key]
            const value = settings[key]

            if (definition.required && (typeof value !== 'string' || value.length === 0)) {
                errors.push({ key, message: `${definition.label} is required` })
                continue
            }

            if (typeof value === 'string' && definition.validate && !definition.validate(value)) {
                errors.push({ key, message: `${definition.label} is invalid` })
            }
        }

        return errors
    }

    async save(settings: CliSettings): Promise<void> {
        await mkdir(dirname(SETTINGS_FILE), { recursive: true })
        await writeFile(SETTINGS_FILE, `${JSON.stringify(settings, null, 4)}\n`, { mode: 0o600 })
        this.settings = settings
    }

    isLoaded(): boolean {
        return this.settings !== null
    }

    get<K extends keyof CliSettings>(key: K): CliSettings[K] {
        if (!this.settings) {
            throw new Error('CLI settings are not loaded — call bootstrap() first.')
        }

        return this.settings[key]
    }

    getAll(): CliSettings {
        if (!this.settings) {
            throw new Error('CLI settings are not loaded — call bootstrap() first.')
        }

        return this.settings
    }
}

export const cliSettingsProvider: CliSettingsProvider = new CliSettingsProvider()
