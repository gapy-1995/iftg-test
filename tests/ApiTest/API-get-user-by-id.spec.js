import { request, test, expect } from '@playwright/test'
import { GetUser } from '../../services/GetUser'
import { tearDownService } from '../../services/baseService'
test.describe('Validate API get users', async () => {
    const userId = 2
    let getUserService;
    test.beforeEach('init test', async ({ request }) => {
        getUserService = new GetUser()
        await getUserService.init()
    })

    test('Case 1: Validate response user ID', {
        tag: ['@fastTest','@api'],
    }, async () => {
        const userId = 2
        getUserService.inputUserId(userId)
        let resp = await getUserService.sendRequest()
        let respBody = await resp.json()

        await expect(resp.status()).toBe(200)
        await expect(respBody.data['first_name']).toBeDefined()
        await expect(respBody.data['id']).toBe(userId)
    })
    
    test('Case 2: Valid email format', {
        tag:['@fastTest','@api'],
    }, async () => {
        getUserService.inputUserId(userId)
        let resp = await getUserService.sendRequest()
        let respBody = await resp.json()
        
        await expect(resp.status()).toBe(200)
        await expect(respBody.data['email']).toMatch(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) 
    })

    test(`Case 3: Validate status code = 404 with queryParam: userId='invalid'`,{
        tag:['@negativeTest','@api']
    }, async() => {
        let invalidUserId = 'aabasda'
        getUserService.inputUserId(invalidUserId)
        let resp = await getUserService.sendRequest()

        await expect(resp.status()).toBe(404)
    })

    test('Case 4: missing input user id',{
        tag:['@negativeTest','@api']
    }, async () => {
        let emptyUserId = null
        getUserService.inputUserId(emptyUserId)
        let resp = await getUserService.sendRequest()
        let respBody = await resp.json()

        await expect(resp.status()).toBe(404)
    })

    test.afterEach('teardown', async () => {
        tearDownService(getUserService)
    })
})