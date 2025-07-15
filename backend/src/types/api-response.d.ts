import { PaginationMeta } from "./pagination"

export type APIResponse<T = unknown> = {
  data: T;
  meta?: APIResponseMeta;
};

export type APIResponseMeta = {
  pagination?: PaginationMeta
}