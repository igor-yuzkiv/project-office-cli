import type { TaskPriorityValue } from '@/entities/task/types'

export type TaskPriorityInputName = 'none' | 'low' | 'medium' | 'high' | 'urgent'

const TASK_PRIORITY_VALUES: Record<TaskPriorityInputName, TaskPriorityValue> = {
    none: 0,
    low: 10,
    medium: 50,
    high: 75,
    urgent: 100,
}

export function resolveTaskPriority(name: string): TaskPriorityValue {
    const key = name.toLowerCase() as TaskPriorityInputName

    if (!(key in TASK_PRIORITY_VALUES)) {
        throw new Error(`Unknown priority "${name}". Expected one of: ${Object.keys(TASK_PRIORITY_VALUES).join(', ')}.`)
    }

    return TASK_PRIORITY_VALUES[key]
}
