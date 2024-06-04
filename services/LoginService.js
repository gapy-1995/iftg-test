import { BaseService } from "./baseService";

export class LoginService extends BaseService {
    response;
    endpoint;
    constructor(requestContext) {
        super(requestContext);
        this.endpoint = 'login';
    }
    inputUserCredentials(email, password) {

        let credentials = {
            email: email,
            password: password
        }
        this.setBodyPayload(credentials);
    }

    async sendRequest() {
        this.response = await this.sendPostRequest(this.endpoint);
        return this.response;
    }
}