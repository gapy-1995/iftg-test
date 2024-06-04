import { BaseService } from "./baseService";

export class DeleteUser extends BaseService {
    response;
    endpoint
    constructor(requestContext) {
        super(requestContext)
        this.endpoint = 'users';

    }
    inputNewUserInfo(payload) {
        super.setBodyPayload(payload)
    }

    inputUserId(userId) {
        return this.endpoint += `/${userId}`
    }

    async sendRequest() {
        this.response = await this.sendDeleteRequest(this.endpoint)
        return this.response
    }
}