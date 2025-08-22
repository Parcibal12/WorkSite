import { API_URL } from "../config/BackendUrl.js";
import authService from "../AuthService.js";

class MyApi {
    constructor(baseUrl) {
        if (MyApi.instance) {
            return MyApi.instance;
        }
        this.baseUrl = baseUrl;
        MyApi.instance = this;
    }

    async saveItem(itemId) {
        const token = authService.getToken();
        const response = await fetch(`${this.baseUrl}/jobs/save`, {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify({ jobId: itemId })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to save item: ${errorData.message}`);
        }
    }

    async unsaveItem(itemId) {
        const token = authService.getToken();
        const response = await fetch(`${this.baseUrl}/jobs/unsave`, {
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify({ jobId: itemId })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to unsave item: ${errorData.message}`);
        }
    }

    async getSavedItems() {
        const token = authService.getToken();
        const response = await fetch(`${this.baseUrl}/jobs/saved`, {
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get saved jobs: ${errorData.message}`);
        }
        const savedJobs = await response.json();
        return savedJobs.map(job => job.id);
    }

    async getItem(itemId) {
        const token = authService.getToken();
        const response = await fetch(`${this.baseUrl}/jobs/${itemId}`, {
            headers: { 
                "Authorization": `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to get item: ${errorData.message}`);
        }
        return await response.json();
    }
}

export default new MyApi(API_URL);