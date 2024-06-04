import { request, test, expect } from '@playwright/test'
import { CreateUser } from '../../services/CreateUser'
import { tearDownService } from '../../services/baseService'
import {DeleteUser} from "../../services/DeleteUser";
test.describe('Validate API delete users', async () => {
    let deleteUserService;
    let createUserService;
    let uid
    const userData = {
        "name": "test1",
        "job": "tester"
    }
    test.beforeEach('init test', async ({ request }) => {
        createUserService = new CreateUser()
        await createUserService.init()
        createUserService.inputUserInfo(userData)
        let resp = await createUserService.sendRequest()
        let respBody = await resp.json()
        uid = respBody.id

        deleteUserService = new DeleteUser()
        await deleteUserService.init()
    })

    test('Case 1: Validate status code = 204 with valid userId', {
        tag: ['@fastTest','@api'],
    }, async () => {
        deleteUserService.inputUserId(uid)
        let resp = await deleteUserService.sendRequest()
        await expect(resp.status()).toBe(204)

    })

    test('Case 2 : validate non-existing or invalid format userId', {tag: '@failTest'}, async () => {
        const invalidUserId = 'invalid-user-id'
        deleteUserService.inputUserId( invalidUserId)
        let resp = await deleteUserService.sendRequest()
        await expect(resp.status()).toBe(404) // test failed as expect

    })

    test('Case 3: empty pathParam user id', {tag: '@failTest'}, async () => {
        const emptyUerId = null;
        deleteUserService.inputUserId(emptyUerId)
        let resp = await deleteUserService.sendRequest()
        await expect(resp.status()).toBe(404)
    })
    test.afterEach('teardown', async () => {
        tearDownService(deleteUserService)
    })
})