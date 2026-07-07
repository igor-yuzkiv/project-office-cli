// Resolves a CLI text option that may be inline text, a `@<path>` file reference, or `-`
// for stdin — used for long-form input like `--description` / `--content`.
export async function resolveTextInput(raw: string): Promise<string> {
    if (raw === '-') {
        return (await Bun.stdin.text()).trim()
    }

    if (raw.startsWith('@')) {
        return (await Bun.file(raw.slice(1)).text()).trim()
    }

    return raw
}
