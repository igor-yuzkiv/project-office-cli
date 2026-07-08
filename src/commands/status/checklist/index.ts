import { checkCliSettings } from '@/commands/status/checklist/01-cli-settings.check.ts'
import { checkRepositoryLink } from '@/commands/status/checklist/02-repository-link.check.ts'
import { checkServerConnection } from '@/commands/status/checklist/03-server-connection.check.ts'
import { checkAuthentication } from '@/commands/status/checklist/04-authentication.check.ts'
import { checkProjectAccess } from '@/commands/status/checklist/05-project-access.check.ts'
import type { StatusCheckDefinition } from '@/commands/status/status.type.ts'

export const checklist: StatusCheckDefinition[] = [
    { title: 'CLI settings', run: checkCliSettings },
    { title: 'Repository link', run: checkRepositoryLink },
    { title: 'Server connection', run: checkServerConnection },
    { title: 'Authentication', run: checkAuthentication },
    { title: 'Project access', run: checkProjectAccess },
]
