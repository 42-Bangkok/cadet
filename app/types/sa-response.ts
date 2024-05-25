/**
 * Represents a response object for Server Actions.
 * @template T - The type of the data.
 */
export type SAResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };
