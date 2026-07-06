import { Command } from 'commander'

import { httpClient } from '@/shared/libs/http'

export const debugCommand = new Command('debug').description('Debug command for local testing').action(async () => {
    console.log('Project Office CLI debug command is working.')

    const response = await httpClient.get('/test')
    console.log(response.data)
})
