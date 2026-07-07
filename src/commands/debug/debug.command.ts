import { Command } from 'commander'

import { httpClient } from '@/shared/libs/http'
import { projectOfficeContextProvider } from '@/shared/libs/project-office'

export const debugCommand = new Command('debug').description('Debug command for local testing').action(async () => {
    console.log('Project Office CLI debug command is working.')
    console.log(projectOfficeContextProvider.getProjectId())

    const response = await httpClient.get('/test')
    console.log(response.data)
})
