export type PaginationQuery = {
  page?: number
  pageSize?: number
}

export type PaginationMeta = {
  page: number
  pageSize: number
  total: number
}

export type Pagination<T> = {
  items: T[],
} & PaginationMeta