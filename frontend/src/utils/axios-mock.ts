class AxiosInstanceMock {
  defaults: any = { headers: {} };
  interceptors = {
    request: {
      handlers: [] as any[],
      use(onFulfilled: any, onRejected: any) {
        this.handlers.push({ onFulfilled, onRejected });
        return this.handlers.length - 1;
      },
      eject(id: number) {
        this.handlers[id] = null;
      }
    },
    response: {
      handlers: [] as any[],
      use(onFulfilled: any, onRejected: any) {
        this.handlers.push({ onFulfilled, onRejected });
        return this.handlers.length - 1;
      },
      eject(id: number) {
        this.handlers[id] = null;
      }
    }
  };

  private baseURL: string = '';

  constructor(config?: any) {
    if (config?.baseURL) {
      this.baseURL = config.baseURL;
    }
  }

  private async request(method: string, url: string, data?: any) {
    let config: any = {
      method,
      url: `${this.baseURL}${url}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data,
    };

    // Run request interceptors
    for (const handler of this.interceptors.request.handlers) {
      if (handler && handler.onFulfilled) {
        config = await handler.onFulfilled(config);
      }
    }

    try {
      const fetchResponse = await fetch(config.url, {
        method: config.method,
        headers: config.headers,
        body: config.data ? JSON.stringify(config.data) : undefined,
      });

      const responseData = await fetchResponse.json().catch(() => ({}));

      let response: any = {
        data: responseData,
        status: fetchResponse.status,
        statusText: fetchResponse.statusText,
        headers: fetchResponse.headers,
        config,
      };

      if (!fetchResponse.ok) {
        const error: any = new Error(`Request failed with status code ${fetchResponse.status}`);
        error.response = response;
        throw error;
      }

      // Run response interceptors
      for (const handler of this.interceptors.response.handlers) {
        if (handler && handler.onFulfilled) {
          response = await handler.onFulfilled(response);
        }
      }

      return response;
    } catch (error: any) {
      let activeError = error;
      // Run response interceptors error handlers (e.g. to handle 401 redirects)
      for (const handler of this.interceptors.response.handlers) {
        if (handler && handler.onRejected) {
          try {
            await handler.onRejected(activeError);
          } catch (newError) {
            activeError = newError;
          }
        }
      }
      throw activeError;
    }
  }

  async get(url: string) {
    return this.request('GET', url);
  }

  async post(url: string, data?: any) {
    return this.request('POST', url, data);
  }

  async put(url: string, data?: any) {
    return this.request('PUT', url, data);
  }

  async delete(url: string) {
    return this.request('DELETE', url);
  }
}

const axiosMock = {
  create: (config?: any) => {
    return new AxiosInstanceMock(config);
  }
};

export default axiosMock;
