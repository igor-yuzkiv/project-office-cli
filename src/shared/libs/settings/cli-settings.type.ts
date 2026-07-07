export interface CliSettings {
    backendBaseUrl: string
    backendUserProfilePath: string
    apiBaseUrl: string
    apiToken: string
}

export type CliSettingsSetupDefinition = {
    [K in keyof CliSettings]: CliSettingsSetupDefinitionItem<CliSettings[K]>
}

export type CliSettingsSetupDefinitionItem<TValue> = {
    label: string
    prompt: string
    value?: TValue
    password?: boolean
}
