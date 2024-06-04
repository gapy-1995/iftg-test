import { BaseService } from "./baseService";

export class CreateUser extends BaseService {
    response;
    endpoint;
    constructor(requestContext) { 
        super(requestContext);
        this.endpoint = 'users';
    }
    inputUserInfo(payload) {
        super.setBodyPayload(payload);
    }

    async sendRequest() {
        this.response = await this.sendPostRequest(this.endpoint);
        return this.response;
    }
}