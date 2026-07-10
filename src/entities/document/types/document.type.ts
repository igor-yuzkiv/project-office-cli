import type { Tag } from '@/entities/tag'

export type DocumentStatus = 'draft' | 'in_review' | 'active' | 'deprecated' | 'archived'

export interface DocumentPathNode {
    id: string
    key: string
    title: string
}

export interface Document {
    id: string
    key: string
    title: string
    status: DocumentStatus
    content: string | null
    tags: Tag[]
    path: DocumentPathNode[]
}

export interface CreateDocumentInput {
    title: string
    content?: string | null
    tags?: string
}

export interface UpdateDocumentInput {
    title?: string
    content?: string | null
    tags?: string
}
