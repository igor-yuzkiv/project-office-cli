import overview from '@/commands/instructions/content/overview.md' with { type: 'text' }
import projectView from '@/commands/instructions/content/project-view.md' with { type: 'text' }
import taskList from '@/commands/instructions/content/task-list.md' with { type: 'text' }
import taskSearch from '@/commands/instructions/content/task-search.md' with { type: 'text' }
import taskView from '@/commands/instructions/content/task-view.md' with { type: 'text' }
import taskComments from '@/commands/instructions/content/task-comments.md' with { type: 'text' }
import install from '@/commands/instructions/content/install.md' with { type: 'text' }
import debug from '@/commands/instructions/content/debug.md' with { type: 'text' }

export const instructionsOverview = overview

export const instructionsRegistry: Record<string, string> = {
    'project:view': projectView,
    'task:list': taskList,
    'task:search': taskSearch,
    'task:view': taskView,
    'task:comments': taskComments,
    install: install,
    debug: debug,
}
