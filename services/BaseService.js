import {request} from '@playwright/test'
import * as url from "node:url";

export class BaseService {
    bodyPayload
    apiContext
    constructor() {
        this.apiContext = null;
    }

   async init() {
    this.apiContext = await request.newContext({});
   };

    async sendGetRequest(url) {
        try {
            return await this.apiContext.get(url, {
                headers: this.setHeader(process.env.ACCESS_TOKEN)
            });
        } catch (error) {
            console.error('Error sending GET request:',     error);
            return null;
        }
    }

    setHeader(token = '', contentType = 'application/json') {
        return {
            'Content-Type': contentType,
            'Authorization': `Bearer ${token}`
        }
    }

    setBodyPayload(payload) {
        this.bodyPayload = JSON.stringify(payload)
    }

    async sendPostRequest(url) {
        try {
            return await this.apiContext.post(url, {
                  headers: this.setHeader(process.env.ACCESS_TOKEN),
                  data: this.bodyPayload
              })
        } catch (error) {
            console.error('Error sending POST request:', error);
            return null;
        }   
    }

    async sendPutRequest(url) {
        try {
            return await this.apiContext.put(url, {
                headers: this.setHeader(process.env.ACCESS_TOKEN),
                data: this.bodyPayload,
            })
        } catch (error) {
            console.error('Error sending PUT request:', error);
            return null;
        }   
    }

    async sendDeleteRequest(url) {
        try {
            return await this.apiContext.delete(url, {
                headers: this.setHeader(process.env.ACCESS_TOKEN),
            })
        } catch (error) {
            console.error('Error sending DELETE request:', error);
            return null;
        }
    }
}

const tearDownService = (service) => {
    if(service) {
        service = null
    }
}

export {tearDownService}