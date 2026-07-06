import { Command } from 'commander'

export const debugCommand = new Command('debug').description('Debug command for local testing').action(() => {
    console.log('Project Office CLI debug command is working.')
})
