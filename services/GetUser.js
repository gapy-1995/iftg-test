
import { BaseService } from './baseService'

export class GetUser extends BaseService {
    response
   
    constructor(requestContext){
        super(requestContext)
        this.endpoint = 'users'
    }
    inputUserId(userId) {
        return this.endpoint += `/${userId}` 
    }

    async sendRequest() {
        this.response = await this.sendGetRequest(this.endpoint)
        return this.response
    }
}

