export interface RequestOptions {
  params?: Record<string, unknown>;
  body?: unknown;
  headers?: Record<string, string>;
  contentType?: string;
  statusCode?: number | number[];
}
