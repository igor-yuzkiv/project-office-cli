import { httpClient } from '@/shared/libs/http'
import type { UserOverviewDto } from '@/entities/user/types'

interface UserProfileResponse {
    data: UserOverviewDto
}

export async function fetchUserProfileRequest(): Promise<UserProfileResponse> {
    return httpClient.get<UserProfileResponse>('me').then((response) => response.data)
}
