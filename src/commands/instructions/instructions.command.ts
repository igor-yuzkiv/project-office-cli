import { Command } from 'commander'

import { instructionsOverview, instructionsRegistry } from '@/commands/instructions/instructions.registry'

function buildOverview(): string {
    const index = Object.keys(instructionsRegistry)
        .map((key) => `- ${key}`)
        .join('\n')

    return `${instructionsOverview}\n${index}\n`
}

export const instructionsCommand = new Command('instructions')
    .description('Prints agent-facing instructions for this CLI or a specific command.')
    .argument('[command]', 'Command name to print instructions for (e.g. task:view)')
    .action((command?: string) => {
        if (!command) {
            console.log(buildOverview())
            return
        }

        const instructions = instructionsRegistry[command]
        if (!instructions) {
            console.error(
                `Unknown command "${command}". Available commands: ${Object.keys(instructionsRegistry).join(', ')}`
            )
            process.exitCode = 1
            return
        }

        console.log(instructions)
    })
