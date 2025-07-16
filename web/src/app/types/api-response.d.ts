import { APIPaginationMeta } from "./api-pagination";

export interface APIResponse<T = unknown> {
  data: T,
  pagination: APIPaginationMeta
}
