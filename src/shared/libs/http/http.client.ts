import axios from 'axios'

import { cliSettingsProvider } from '@/shared/libs/settings'
import { mapAxiosErrorToHttpError } from '@/shared/libs/http/http.error'

const httpClient = axios.create({ baseURL: Bun.env.API_BASE_URL })

httpClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${cliSettingsProvider.get('apiToken')}`
    return config
})

httpClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(mapAxiosErrorToHttpError(error))
)

export { httpClient }
