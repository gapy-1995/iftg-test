import {test, expect} from '@playwright/test';
import {LoginService} from "../../services/LoginService";

test.describe('API-post-login.spec.js', async () => {
    let loginService
    test.beforeEach('clear ACCESS_TOKEN', async() => {
        process.env.ACCESS_TOKEN = ''
        loginService = new LoginService();
        await loginService.init()
    });

    test('Case 1: input valid email and password', async() => {
        const email = process.env.USER_NAME
        const password = process.env.PASSWORD
        loginService.inputUserCredentials(email, password)
        let resp = await loginService.sendRequest()
        let respBody = await resp.json();

        await expect(resp.status()).toBe(200)
        await expect(respBody.token).toBeDefined()
    })

    test('Case 2: input invalid email and passwod', async () => {
        const email = 'invalid email'
        const password = process.env.PASSWORD
        loginService.inputUserCredentials(email, password)
        let resp = await loginService.sendRequest()
        let respBody = await resp.json();

        await expect(resp.status()).toBe(400)
        await expect(respBody).toEqual({"error": "user not found"})
    })

    test('Case 3: empty email and password ', async () => {
        const email = ''
        const password = ''
        loginService.inputUserCredentials(email, password)
        let resp = await loginService.sendRequest()
        let respBody = await resp.json();

        await expect(resp.status()).toBe(400)
        await expect(respBody).toEqual({"error": "Missing email or username"})
    })

    test('Case 4: non existing user ', async () => {
        const email = 'nonexistsuser@abc.com'
        const password = 'test123@'
        loginService.inputUserCredentials(email, password)
        let resp = await loginService.sendRequest()
        let respBody = await resp.json();

        await expect(resp.status()).toBe(404)
        await expect(respBody).toEqual({"error": "user not found"})
    })
});