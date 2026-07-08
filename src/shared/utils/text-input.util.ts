import { ExitCode } from '@/shared/config'

// Resolves a CLI text option that may be inline text, a `@<path>` file reference, or `-`
// for stdin — used for long-form input like `--description` / `--content`.
// `@-` is accepted as stdin too: agents synthesize it by analogy with other CLIs, and
// treating it as a file named `-` produced a confusing ENOENT (MTM-2).
export async function resolveTextInput(raw: string): Promise<string> {
    if (raw === '-' || raw === '@-') {
        return (await Bun.stdin.text()).trim()
    }

    if (raw.startsWith('@')) {
        const path = raw.slice(1)

        try {
            return (await Bun.file(path).text()).trim()
        } catch (error) {
            console.error(`Cannot read input file "${path}": ${error instanceof Error ? error.message : String(error)}`)
            process.exit(ExitCode.GenericError)
        }
    }

    return raw
}
