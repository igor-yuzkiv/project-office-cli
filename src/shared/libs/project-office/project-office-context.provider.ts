import { existsSync } from 'node:fs'
import { dirname, isAbsolute, join, parse } from 'node:path'

import type { OfficeSettings, RepoSettings } from '@/shared/libs/project-office/project-office-context.type'
import {
    PROJECT_OFFICE_CONTEXT_DIR,
    PROJECT_OFFICE_SETTINGS_FILE,
    PROJECT_REPO_CONTEXT_DIR,
    PROJECT_REPO_SETTINGS_FILE,
} from '@/shared/config'

class ProjectOfficeContextProvider {
    private officeSettings: OfficeSettings | null = null
    private resolutionError: Error | null = null

    async bootstrap(launchDir: string = process.cwd()): Promise<OfficeSettings | null> {
        this.resolutionError = null

        try {
            this.officeSettings = await this.resolve(launchDir)
        } catch (error) {
            this.officeSettings = null
            this.resolutionError = error instanceof Error ? error : new Error(String(error))
        }

        return this.officeSettings
    }

    getProjectId(): string {
        const { projectId } = this.requireOfficeSettings()
        if (typeof projectId !== 'string' || projectId.length === 0) {
            throw new Error(
                `Project Office settings are missing a valid "projectId" in ${PROJECT_OFFICE_CONTEXT_DIR}/${PROJECT_OFFICE_SETTINGS_FILE}.`
            )
        }

        return projectId
    }

    getOfficeSettings(): OfficeSettings {
        return this.requireOfficeSettings()
    }

    private requireOfficeSettings(): OfficeSettings {
        if (this.officeSettings) {
            return this.officeSettings
        }

        if (this.resolutionError) {
            throw this.resolutionError
        }

        throw new Error(
            'No Project Office context — run this command from inside a repository or Project Office ' +
                `containing ${PROJECT_REPO_CONTEXT_DIR}/${PROJECT_REPO_SETTINGS_FILE}.`
        )
    }

    private async resolve(launchDir: string): Promise<OfficeSettings> {
        const markerPath = this.findMarkerUpwards(launchDir)
        if (!markerPath) {
            throw new Error(`No ${PROJECT_REPO_CONTEXT_DIR}/${PROJECT_REPO_SETTINGS_FILE} found from ${launchDir}.`)
        }

        const settings = await this.readMarker(markerPath)

        if (settings.kind === 'office') {
            return settings
        }

        if (settings.kind === 'repo') {
            if (typeof settings.office_path !== 'string' || !isAbsolute(settings.office_path)) {
                throw new Error(`Repo settings at ${markerPath} are missing a valid absolute "office_path".`)
            }

            const officeMarkerPath = join(
                settings.office_path,
                PROJECT_OFFICE_CONTEXT_DIR,
                PROJECT_OFFICE_SETTINGS_FILE
            )
            const officeSettings = await this.readMarker(officeMarkerPath)

            if (officeSettings.kind !== 'office') {
                throw new Error(`Expected an office context at ${officeMarkerPath}, got kind "${officeSettings.kind}".`)
            }

            return officeSettings
        }

        throw new Error(
            `Unknown Project Office context kind "${(settings as { kind: string }).kind}" in ${markerPath}.`
        )
    }

    private findMarkerUpwards(startDir: string): string | null {
        let currentDir = startDir
        const { root } = parse(startDir)

        while (true) {
            const markerPath = join(currentDir, PROJECT_REPO_CONTEXT_DIR, PROJECT_REPO_SETTINGS_FILE)
            if (existsSync(markerPath)) {
                return markerPath
            }

            if (currentDir === root) {
                return null
            }

            currentDir = dirname(currentDir)
        }
    }

    private async readMarker(markerPath: string): Promise<RepoSettings | OfficeSettings> {
        if (!existsSync(markerPath)) {
            throw new Error(`Project Office settings not found at ${markerPath}.`)
        }

        const raw = await Bun.file(markerPath).text()

        let parsed: unknown
        try {
            parsed = JSON.parse(raw)
        } catch {
            throw new Error(`Failed to parse ${markerPath} — it is not valid JSON.`)
        }

        if (parsed === null || typeof parsed !== 'object' || typeof (parsed as { kind?: unknown }).kind !== 'string') {
            throw new Error(`Invalid Project Office settings at ${markerPath} — missing "kind".`)
        }

        return parsed as RepoSettings | OfficeSettings
    }
}

export const projectOfficeContextProvider = new ProjectOfficeContextProvider()
