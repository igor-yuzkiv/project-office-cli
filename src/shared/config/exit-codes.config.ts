export enum ExitCode {
    Ok = 0,
    GenericError = 1,
    ConfigError = 2,
    Unauthenticated = 3,
    NotFound = 4,
    Forbidden = 5,
    BackendUnavailable = 6,
    Conflict = 7,
}
