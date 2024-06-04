// @ts-check
const { defineConfig, devices } = require('@playwright/test');
import * as dotenv from 'dotenv';
import { env } from 'process';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 */

const ENV= process.env.ENV || 'development'
dotenv.config({path: `.env.${ENV}`})
module.exports = defineConfig({
  testDir: './tests/',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'setup',
      use: {
        baseURL: process.env.BASE_API,
        headless: true,
      },
      testMatch: 'tests/*.setup.js'
    },
    {
      name: 'API',
      use: { 
        baseURL: process.env.BASE_API,
        headless: true,
      },
      testDir: 'tests/ApiTest/',
      testMatch: '**/*.spec.js',
      dependencies:['setup']
    },
    {
      name: 'E2E',
      use: {
        baseURL: process.env.BASE_API,
        headless: true,
      },
      testDir: 'tests/E2eTest/',
      testMatch: '**/E2eTest/*.spec.js',
      // dependencies:['setup']
    },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});

