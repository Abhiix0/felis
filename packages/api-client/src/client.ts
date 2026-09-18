export interface FelisApiConfig {
  baseUrl: string;
  getAccessToken: () => string | null;
  onAuthError: () => void;
  onTokenRefresh?: () => Promise<string | null>;
}

export interface ApiError {
  code: string;
  message: string;
  requestId: string;
}

export class FelisApiError extends Error {
  constructor(
    public readonly error: ApiError,
    public readonly statusCode: number
  ) {
    super(error.message);
    this.name = 'FelisApiError';
  }
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export class FelisApiClient {
  constructor(private config: FelisApiConfig) {}

  async request<T>(
    method: string,
    path: string,
    options: {
      body?: unknown;
      clientMutationId?: string;
      retries?: number;
    } = {}
  ): Promise<T> {
    const requestId = generateUUID();
    const { retries = 2 } = options;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
    };

    const token = this.config.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (options.clientMutationId) {
      headers['X-Client-Mutation-ID'] = options.clientMutationId;
    }

    let lastError: Error | null = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(`${this.config.baseUrl}${path}`, {
          method,
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (response.status === 401) {
          this.config.onAuthError();
          throw new FelisApiError(
            { code: 'UNAUTHORIZED', message: 'Session expired', requestId },
            401
          );
        }

        if (!response.ok) {
          const errorBody = (await response.json().catch(() => ({}))) as {
            error?: { code?: string; message?: string; request_id?: string };
          };
          throw new FelisApiError(
            {
              code: errorBody?.error?.code || 'API_ERROR',
              message: errorBody?.error?.message || 'Request failed',
              requestId: errorBody?.error?.request_id || requestId,
            },
            response.status
          );
        }

        if (response.status === 204) {
          return undefined as unknown as T;
        }

        return (await response.json()) as T;
      } catch (err) {
        lastError = err as Error;
        if (err instanceof FelisApiError) throw err;
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 500));
        }
      }
    }
    throw lastError;
  }

  get<T>(path: string) {
    return this.request<T>('GET', path);
  }

  post<T>(path: string, body?: unknown, mutationId?: string) {
    return this.request<T>('POST', path, { body, clientMutationId: mutationId });
  }

  patch<T>(path: string, body?: unknown) {
    return this.request<T>('PATCH', path, { body });
  }

  delete<T>(path: string) {
    return this.request<T>('DELETE', path);
  }
}
