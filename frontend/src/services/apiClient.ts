const DEFAULT_EVZONE_API_URL = resolveDefaultApiUrl();
const DEFAULT_STUDIO_BRIDGE_URL = resolveDefaultStudioBridgeUrl();

type QueryValue = string | number | boolean | null | undefined;

type JsonBody = Record<string, unknown> | unknown[];

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  query?: Record<string, QueryValue>;
  body?: BodyInit | JsonBody;
};

type ApiEnvelope<T> = {
  success: boolean;
  requestId?: string;
  timestamp?: string;
  data?: T;
  message?: string | string[];
  statusCode?: number;
};

export class ApiClientError extends Error {
  constructor(
    message: string,
    readonly status?: number,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

export const EVZONE_API_URL = normalizeUrl(import.meta.env.VITE_EVZONE_API_URL || DEFAULT_EVZONE_API_URL);
export const EVZONE_STUDIO_BRIDGE_URL = normalizeUrl(
  import.meta.env.VITE_EVZONE_STUDIO_BRIDGE_URL || DEFAULT_STUDIO_BRIDGE_URL,
);

export function getStudioBridgeWebSocketUrl() {
  return EVZONE_STUDIO_BRIDGE_URL;
}

export async function evzoneApi<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { query, body, headers: providedHeaders, ...init } = options;
  const url = buildUrl(path, query);
  const headers = new Headers(providedHeaders);
  let requestBody = body;

  if (!headers.has('Accept')) headers.set('Accept', 'application/json');

  if (isJsonBody(body)) {
    requestBody = JSON.stringify(body);
    if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...init,
    headers,
    body: requestBody as BodyInit | undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const envelope = payload as ApiEnvelope<unknown> | undefined;
    throw new ApiClientError(formatApiMessage(envelope?.message, response.statusText), response.status, payload);
  }

  if (isApiEnvelope<T>(payload)) {
    if (!payload.success) {
      throw new ApiClientError(formatApiMessage(payload.message, 'EVzone API request failed'), payload.statusCode, payload);
    }
    return payload.data as T;
  }

  return payload as T;
}

function buildUrl(path: string, query?: Record<string, QueryValue>) {
  const url = new URL(path.replace(/^\/+/, ''), `${EVZONE_API_URL}/`);

  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return undefined;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function isApiEnvelope<T>(payload: unknown): payload is ApiEnvelope<T> {
  return Boolean(payload && typeof payload === 'object' && 'success' in payload && 'data' in payload);
}

function isJsonBody(body: ApiRequestOptions['body']): body is JsonBody {
  if (!body || typeof body !== 'object') return false;
  return !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof URLSearchParams);
}

function normalizeUrl(url: string) {
  return url.replace(/\/+$/, '');
}

function formatApiMessage(message: string | string[] | undefined, fallback: string) {
  if (Array.isArray(message)) return message.join(', ');
  return message || fallback;
}

function resolveDefaultApiUrl() {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://localhost:3777/api/v1';
}

function resolveDefaultStudioBridgeUrl() {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/studio-bridge`;
  }
  return 'ws://localhost:3777/studio-bridge';
}
