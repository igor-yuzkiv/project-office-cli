import overview from '@/commands/instructions/content/overview.md' with { type: 'text' }
import status from '@/commands/instructions/content/status.md' with { type: 'text' }
import projectView from '@/commands/instructions/content/project-view.md' with { type: 'text' }
import projectConnect from '@/commands/instructions/content/project-connect.md' with { type: 'text' }
import projectLinkRepo from '@/commands/instructions/content/project-link-repo.md' with { type: 'text' }
import taskList from '@/commands/instructions/content/task-list.md' with { type: 'text' }
import taskSearch from '@/commands/instructions/content/task-search.md' with { type: 'text' }
import taskView from '@/commands/instructions/content/task-view.md' with { type: 'text' }
import taskComments from '@/commands/instructions/content/task-comments.md' with { type: 'text' }
import taskCreate from '@/commands/instructions/content/task-create.md' with { type: 'text' }
import taskUpdate from '@/commands/instructions/content/task-update.md' with { type: 'text' }
import taskCommentAdd from '@/commands/instructions/content/task-comment-add.md' with { type: 'text' }
import taskCommentUpdate from '@/commands/instructions/content/task-comment-update.md' with { type: 'text' }
import install from '@/commands/instructions/content/install.md' with { type: 'text' }

export const instructionsOverview = overview

export const instructionsRegistry: Record<string, string> = {
    status: status,
    'project:view': projectView,
    'project:connect': projectConnect,
    'project:link-repo': projectLinkRepo,
    'task:list': taskList,
    'task:search': taskSearch,
    'task:view': taskView,
    'task:comments': taskComments,
    'task:create': taskCreate,
    'task:update': taskUpdate,
    'task:comment-add': taskCommentAdd,
    'task:comment-update': taskCommentUpdate,
    install: install
}
