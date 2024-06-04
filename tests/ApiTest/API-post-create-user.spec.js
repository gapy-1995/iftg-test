import { request, test, expect } from '@playwright/test'
import { CreateUser } from '../../services/CreateUser'
import { tearDownService } from '../../services/baseService'
test.describe('Validate API Create new users', async () => {
    const userId = 2
    let createUserService;
    test.beforeEach('init test', async ({ request }) => {
        createUserService = new CreateUser(request)
        await createUserService.init()
    })

    test('Case 1: Input valid payload user ', {
        tag: '@fastTest',
    }, async () => {

        const data = {
            "name": "test1",
            "job": "tester"
        }
        await createUserService.inputUserInfo(data)
        let response = await createUserService.sendRequest()
        const respBody = await response.json()
        console.log(respBody)

        await expect(response.status()).toBe(201)
        await expect(respBody.name).toBe(data.name)
        await expect(respBody.job).toBe(data.job)  
    })

    test('Case 2: Invalid Body payload request',{
        tag: '@fastTest',

    }, async() =>{
        let testData = 'invalid body request'
        await createUserService.inputUserInfo(testData)
        let response = await createUserService.sendRequest()
        await expect(response.status()).toBe(400)
    })
    
    
    test('Case 3: Missing job or missing name ',{
        tag: '@failTest',
    }, async() => {
        // missing job property
        let testData1  = {
            "name": "test1"
        }
        createUserService.inputUserInfo(testData1)
        let response1 = await createUserService.sendRequest()
        await expect.soft(response1.status()).toBe(400)

        // missing name property
        let testData2 = {
            "job": "tester"
        }

        await createUserService.inputUserInfo(testData2)
        let response2 = await createUserService.sendRequest()
        await expect(response2.status()).toBe(400)
    })
    test.afterEach('teardown', async () => {
        tearDownService(createUserService)
    })
})