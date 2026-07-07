export interface RepoSettings {
    kind: 'repo'
    office_path: string
}

export interface OfficeSettings {
    kind: 'office'
    projectId?: string
}
