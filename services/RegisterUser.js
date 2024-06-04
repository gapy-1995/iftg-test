import { BaseService } from "./baseService";

export class RegisterUser extends BaseService {
    response;
    endpoint;
    constructor(requestContext) {
        super(requestContext);
        this.endpoint = 'register';
    }
    inputUserInfo(payload) {
        super.setBodyPayload(payload);
    }

    async sendRequest() {
        this.response = await this.sendPostRequest(this.endpoint);
        const resp = await this.response.json()
        console.log(resp)
        return this.response;
    }
}