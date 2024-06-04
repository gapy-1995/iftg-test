import { test, request as playwrightRequest, expect, APIRequestContext } from '@playwright/test'
import { CreateUser } from '../../services/CreateUser'
import { UpdateUser } from '../../services/UpdateUser'
import { GetUser}     from "../../services/GetUser";
import { tearDownService } from '../../services/baseService'
import exp from "node:constants";
test.describe('Validate API update users', async () => {
    let uid
    let updateUserService;
    let createUserService;
    let getUserService;
    const userData = {
        "name": "test1",
        "job": "tester"
    }

    test.beforeEach('init test', async () => {
        createUserService = new CreateUser()
        await createUserService.init()
        updateUserService = new UpdateUser()
        await updateUserService.init()

        getUserService = new GetUser()
        await getUserService.init()

        createUserService.inputUserInfo(userData)
        let resp = await createUserService.sendRequest()
        let respBody = await resp.json()
        uid = respBody.id
    })

    test('Case 1: update new user info to current user', {
        tag: '@fastTest',
    }, async ({request}) => {
        const data1 = { "name" : "new tester name"}
        console.log(uid)
        updateUserService.inputUserId(uid)
        updateUserService.inputNewUserInfo(data1)
        let resp = await updateUserService.sendRequest()
        let responseBody = await resp.json()
        await expect(resp.status()).toBe(200)
        await expect(responseBody.name).toEqual(data1.name)
    })

    test('Case 2: Validate input invalid userId', {
        tag: '@fastTest',
    }, async () => {
        let invalidUID = '1000000000'
        const data1 = { "name" : "new tester name"}

        console.log(uid)
        updateUserService.inputUserId(invalidUID)
        updateUserService.inputNewUserInfo(data1)
        let resp = await updateUserService.sendRequest()
        await expect(resp.status()).toBe(404) // test failed as expect
        // await expect(resp.ok()).toBeFalsy()
    })

    test('Case 3: empty body payload ',{
        tag: '@failedTest',},async ()=>
    {
        const invalidFormatData = ''
        updateUserService.inputUserId(uid)
        updateUserService.inputNewUserInfo(invalidFormatData)
        let resp = await updateUserService.sendRequest()
        await expect(resp.status()).toBe(400)
        await expect(resp.ok()).toBeFalsy()
    })
})