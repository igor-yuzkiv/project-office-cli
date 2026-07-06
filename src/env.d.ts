declare module 'bun' {
    interface Env {
        BACKEND_BASE_URL: string
        BACKEND_USER_PROFILE_PATH: string
        PROJECT_OFFICE_CACHE_DIR?: string
        PROJECT_OFFICE_SETTINGS_FILE?: string
    }
}
