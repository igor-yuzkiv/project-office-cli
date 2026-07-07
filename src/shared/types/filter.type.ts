// MatchMode values accepted by the CLI API `POST tasks/search` endpoint (doc-0004 §4.3).
export type MatchMode =
    | 'startsWith'
    | 'endsWith'
    | 'contains'
    | 'notContains'
    | 'equals'
    | 'notEquals'
    | 'gt'
    | 'gte'
    | 'lt'
    | 'lte'
    | 'dateIs'
    | 'dateIsNot'
    | 'dateBefore'
    | 'dateAfter'
    | 'in'
    | 'notIn'

// Filter families supported by the search endpoint: `text` and `lookup` require a
// `field_name`, `tags` does not (doc-0004 §4.3).
export type FilterKey = 'text' | 'lookup' | 'tags'

export interface FilterPayloadItem {
    filter_key: FilterKey
    field_name?: string | null
    value?: unknown
    matchMode?: MatchMode | null
    params?: Record<string, unknown>
}
