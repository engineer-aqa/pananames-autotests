import { APIRequestContext, APIResponse, expect, request } from '@playwright/test';
import { HttpMethod } from '@api/types/api-response.types';
import { RequestOptions } from '@api/types/api-client.types';
import { environment } from '@support/env-config';

/**
 * Request context shared by every client of the worker. The application keeps
 * its session in cookies, and the context holds its own cookie jar, so the
 * session obtained by the login is available to all services afterwards.
 */
let requestContext: APIRequestContext;

/**
 * Transport-level HTTP client: builds the request, sends it and validates the
 * status code. It knows nothing about endpoints or business entities - that
 * belongs to the services in `src/api/services`.
 */
export class ApiClient {
  readonly apiUrl: string;

  constructor(apiUrl?: string) {
    this.apiUrl = apiUrl ?? environment().baseUrl;
  }

  async get(uri: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('GET', uri, { statusCode: 200, ...options });
  }

  async post(uri: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('POST', uri, { statusCode: [200, 201], ...options });
  }

  async delete(uri: string, options: RequestOptions = {}): Promise<APIResponse> {
    return this.send('DELETE', uri, { statusCode: [200, 204], ...options });
  }

  /** Cookies collected so far, i.e. the current session. */
  async getCookies(): Promise<Awaited<ReturnType<APIRequestContext['storageState']>>['cookies']> {
    const { cookies } = await (await this.context()).storageState();
    return cookies;
  }

  private async send(method: HttpMethod, uri: string, options: RequestOptions): Promise<APIResponse> {
    const { params, body, statusCode } = options;
    const url = `${this.apiUrl}${uri}`;
    const context = await this.context();

    const response = await context.fetch(url, {
      method,
      headers: this.headerBuilder(options),
      ...(params && { params: this.stringifyParams(params) }),
      ...(body !== undefined && { data: body }),
    });

    const expectedStatuses = Array.isArray(statusCode) ? statusCode : [statusCode];
    const responseBody = await response.text();
    expect(expectedStatuses, `${method} ${url} returned ${response.status()}: ${responseBody}`).toContain(response.status());

    return response;
  }

  private async context(): Promise<APIRequestContext> {
    requestContext ??= await request.newContext();
    return requestContext;
  }

  private headerBuilder({ headers = {}, contentType = 'application/json' }: RequestOptions): Record<string, string> {
    return { 'Content-Type': contentType, ...headers };
  }

  private stringifyParams(params: Record<string, unknown>): Record<string, string> {
    return Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]));
  }
}
