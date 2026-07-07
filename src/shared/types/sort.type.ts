export type SortDirection = 'asc' | 'desc'

export interface SortParams {
    sort_by?: string
    sort_order?: SortDirection
}
