import { test as setup, expect } from '@playwright/test';

setup('Login via API', async ({ request }) => {
    const response = await request.post('login', {
        data: {
            email: process.env.USER_NAME,
            password: process.env.PASSWORD
        }
    })
    await expect(response.status()).toBe(200)
    const responseBody = await response.json();
    const token = responseBody.token 
    process.env.ACCESS_TOKEN = token
})
