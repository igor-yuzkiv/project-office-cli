import axios from 'axios'

import { cliSettingsProvider } from '@/shared/libs/settings'
import { mapAxiosErrorToHttpError } from '@/shared/libs/http/http.error'

const httpClient = axios.create()

httpClient.interceptors.request.use((config) => {
    config.baseURL = cliSettingsProvider.get('apiBaseUrl')
    config.headers.Authorization = `Bearer ${cliSettingsProvider.get('apiToken')}`
    return config
})

httpClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(mapAxiosErrorToHttpError(error))
)

export { httpClient }
