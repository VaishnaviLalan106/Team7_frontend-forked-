const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('prepnova_token');
        const { body, headers: customHeaders, ...rest } = options;

        let headers = {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            ...customHeaders,
        };

        let requestBody = body;

        // Auto-detect JSON and set Content-Type if not already set
        const isSpecialBody = body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob;

        if (body && !isSpecialBody) {
            if (!headers['Content-Type']) {
                headers['Content-Type'] = 'application/json';
            }
            if (typeof body === 'object') {
                requestBody = JSON.stringify(body);
            }
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...rest,
            headers,
            body: requestBody
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw {
                response: {
                    data: errorData,
                    status: response.status,
                    statusText: response.statusText
                }
            };
        }

        const data = await response.json();
        return { data, headers: response.headers };
    },

    get(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'GET' });
    },

    post(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'POST', body });
    },

    put(endpoint, body, options) {
        return this.request(endpoint, { ...options, method: 'PUT', body });
    },

    delete(endpoint, options) {
        return this.request(endpoint, { ...options, method: 'DELETE' });
    }
};

export default api;
