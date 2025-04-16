export abstract class BaseClient {
    protected baseURL: string;
  
    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    async getMethod<T>(relativeUrl: string): Promise<T> {
        const url = `${this.baseURL}/${relativeUrl}`;
        console.log(`GET ${url}`);

        const response = await fetch(url);
        return response.json() as Promise<T>;
    }

    async postMethod<O, I>(relativeUrl: string, payload: I): Promise<O> {
        const url = `${this.baseURL}/${relativeUrl}`;
        console.log(`POST ${url} with payload:`, payload);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return response.json() as Promise<O>;
    }

}
