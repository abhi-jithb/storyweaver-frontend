/**
 * Fetch with retry logic and concurrency control
 */

export interface FetchOptions extends RequestInit {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
}

/**
 * Enhanced fetch with timeout and retries
 */
export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<Response> {
    const { timeout = 10000, retries = 3, retryDelay = 1000, ...fetchOptions } = options;

    let lastError: Error | null = null;

    for (let i = 0; i < retries + 1; i++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            if (i > 0) {
                // Wait before retrying (exponential backoff)
                const delay = retryDelay * Math.pow(2, i - 1);
                await new Promise((resolve) => setTimeout(resolve, delay));
                console.log(`Retrying fetch for ${url} (attempt ${i}/${retries})`);
            }

            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal,
            });

            clearTimeout(id);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error: any) {
            clearTimeout(id);
            lastError = error;

            // Don't retry if it's an abort error (manual or timeout)
            if (error.name === 'AbortError' && i === retries) {
                console.warn(`Fetch timed out for ${url}`);
            }

            console.warn(`Fetch attempt ${i + 1} failed for ${url}:`, error.message);
        }
    }

    throw lastError || new Error(`Failed to fetch ${url} after ${retries} retries`);
}

/**
 * Simple concurrency limiter
 */
export class ConcurrencyLimiter {
    private activeCount = 0;
    private queue: (() => void)[] = [];

    constructor(private maxConcurrency: number = 6) { }

    async run<T>(task: () => Promise<T>): Promise<T> {
        if (this.activeCount >= this.maxConcurrency) {
            await new Promise<void>((resolve) => this.queue.push(resolve));
        }

        this.activeCount++;
        try {
            return await task();
        } finally {
            this.activeCount--;
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                if (next) next();
            }
        }
    }
}
