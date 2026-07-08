export interface CliSettings {
    backendBaseUrl: string
    backendUserProfilePath: string
    apiBaseUrl: string
    apiToken: string
}

export type CliSettingsDefinition = {
    [K in keyof CliSettings]: CliSettingsDefinitionItem
}

export type CliSettingsDefinitionItem = {
    label: string
    prompt: (collected?: Partial<CliSettings>) => string
    value?: string
    password?: boolean
    required?: boolean
    validate?: (value: string) => boolean
}

export interface CliSettingsValidationError {
    key: keyof CliSettings
    message: string
}
