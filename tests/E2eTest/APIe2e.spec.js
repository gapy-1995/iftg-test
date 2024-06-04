import {test, expect} from '@playwright/test'
import {RegisterUser} from "../../services/RegisterUser";
import {UpdateUser} from "../../services/UpdateUser";
import {CreateUser} from "../../services/CreateUser";
import {LoginService} from "../../services/LoginService";
import {DeleteUser} from "../../services/DeleteUser";
import {GetUser} from "../../services/GetUser";

test.describe('End to end API test', async () => {
    let registerUserService;
    let createUserService;
    let updateUserService;
    let loginService;
    let deleteUserService;
    let getUserService;
    let resp
    let respBody
    let userId;
    test('Scenario 1: given user create new user ' +
        'then create new user with new credentials ' +
        'and update user name ', async () => {
        const userInfo = {
            "email": "eve.holt@reqres.in",
            "password": "pistol"
        }
        registerUserService = new RegisterUser()
        await registerUserService.init()
        registerUserService.inputUserInfo(userInfo)
        resp = await registerUserService.sendRequest()

        respBody = await resp.json()
        await expect(resp.status()).toBe(200)
        process.env.ACCESS_TOKEN = respBody.token // assign new token to global access_token

        // create new user
        const newUser = {
            "name": "Jonas",
            "job":"leader"
        }

        createUserService = new CreateUser(newUser)
        await createUserService.init()
        createUserService.inputUserInfo(newUser)
        resp = await createUserService.sendRequest()
        respBody = await resp.json()
        userId = respBody.id

        // update user name and jobs
        const newJob = {
            "name": "Jonas",
            "job": "manager"
        }
        updateUserService = new UpdateUser()
        await updateUserService.init();

        updateUserService.inputUserId(userId)
        updateUserService.inputNewUserInfo(newJob)
        resp = await updateUserService.sendRequest()
        respBody = await resp.json()

        await expect(resp.status()).toBe(200)
        await expect(respBody.name).toEqual(newJob.name)
        await expect(respBody.job).toEqual(newJob.job)
    })

    test('Scenario 2: given user login with super user' +
        'then get user with user id = 2  ' +
        'and delete this user ' +
        'and create new use ', async () => {
        const email = process.env.USER_NAME
        const password = process.env.PASSWORD
        const userId = 1
        loginService = new LoginService()
        await loginService.init()

        loginService.inputUserCredentials(email, password)
        resp = await loginService.sendRequest()
        await expect(resp.status()).toBe(200)
        respBody = await resp.json()
        process.env.ACCESS_TOKEN = respBody.token


        // get user with user id = 1
        getUserService = new GetUser();
        await getUserService.init()
        getUserService.inputUserId(userId)
        resp = await getUserService.sendRequest()
        await expect(resp.status()).toBe(200)
        respBody = await resp.json()
        let currentUserName = respBody.data['first_name'] + ' ' + respBody.data['last_name']
        console.log(currentUserName)

        // delete user with user id = 1
        deleteUserService = new DeleteUser();
        await deleteUserService.init()
        deleteUserService.inputUserId(userId)
        resp = await deleteUserService.sendRequest()
        await expect(resp.status()).toBe(204)

        // create new user with same name but different job
        let newUser = {
            "name": currentUserName,
            "job": "manager"
        }

        createUserService = new CreateUser()
        await createUserService.init()
        await createUserService.inputUserInfo(newUser)
        resp = await createUserService.sendRequest()
        respBody = await resp.json()
        console.log(respBody)

        await expect(respBody.name).toEqual(currentUserName)
        await expect(respBody.job).toEqual(newUser.job)
        await expect(resp.status()).toBe(201 )
    })
})