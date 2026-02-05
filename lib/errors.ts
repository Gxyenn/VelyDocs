export type ErrorType =
  | "AUTH_ERROR"
  | "SCRAPING_ERROR"
  | "SOURCE_DOWN"
  | "NOT_FOUND"
  | "INVALID_PARAM";

export class ApiError extends Error {
  constructor(
    public readonly type: ErrorType,
    message: string,
    public readonly status = 500
  ) {
    super(message);
  }
}
