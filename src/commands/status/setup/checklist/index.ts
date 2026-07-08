import { checkCliSettings } from '@/commands/status/setup/checklist/01-cli-settings.check'
import { checkRepositoryLink } from '@/commands/status/setup/checklist/02-repository-link.check'
import { checkServerConnection } from '@/commands/status/setup/checklist/03-server-connection.check'
import { checkAuthentication } from '@/commands/status/setup/checklist/04-authentication.check'
import { checkProjectAccess } from '@/commands/status/setup/checklist/05-project-access.check'
import type { StatusCheckDefinition } from '@/commands/status/status.type'

export const checklist: StatusCheckDefinition[] = [
    { title: 'CLI settings', run: checkCliSettings },
    { title: 'Repository link', run: checkRepositoryLink },
    { title: 'Server connection', run: checkServerConnection },
    { title: 'Authentication', run: checkAuthentication },
    { title: 'Project access', run: checkProjectAccess },
]
