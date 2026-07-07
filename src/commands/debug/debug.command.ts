import { Command } from 'commander'

import { fetchTaskRequest, fetchTasksRequest } from '@/entities/task'
import { projectOfficeContextProvider } from '@/shared/libs/project-office'

// Smoke-tests the API client layer end to end: resolves the project scope from the
// Project Office context and calls a real client method (not a raw HTTP request).
export const debugCommand = new Command('debug')
    .description('Debug command for local testing of the API client')
    .action(async () => {
        const projectId = projectOfficeContextProvider.getProjectId()
        const tasksResponse = await fetchTasksRequest(projectId)

        if (!tasksResponse.data.length) {
            console.log('no tasks')
            return
        }

        tasksResponse.data.map((task) => {
            fetchTaskRequest(projectId, task.id)
                .then((t) => console.log(JSON.stringify(t, null, 2)))
                .catch(console.error)
        })
    })
