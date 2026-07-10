import { httpClient } from '@/shared/libs/http'
import type { Document, CreateDocumentInput, UpdateDocumentInput } from '@/entities/document/types'

interface DocumentResponse {
    data: Document
}

export async function fetchDocumentRequest(projectId: string, documentId: string): Promise<DocumentResponse> {
    return httpClient
        .get<DocumentResponse>(`projects/${projectId}/docs/${documentId}`)
        .then((response) => response.data)
}

export async function createDocumentRequest(projectId: string, data: CreateDocumentInput): Promise<DocumentResponse> {
    return httpClient.post<DocumentResponse>(`projects/${projectId}/docs`, data).then((response) => response.data)
}

export async function updateDocumentRequest(
    projectId: string,
    documentId: string,
    data: UpdateDocumentInput
): Promise<DocumentResponse> {
    return httpClient
        .put<DocumentResponse>(`projects/${projectId}/docs/${documentId}`, data)
        .then((response) => response.data)
}
