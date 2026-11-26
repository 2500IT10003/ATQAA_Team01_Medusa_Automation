
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
testDir: './tests',
/* Maximum time for one test case: 60 seconds */
timeout: 60 * 1000,
expect: {
/* Maximum timeout for one assertion: 20 seconds */
timeout: 20000,
},
/* Run all test files in parallel */
fullyParallel: false,
workers: 1,
/* Automatically retry once if running in a staging environment that is unstable */
retries: 1,
/* Export an HTML report upon completion */
reporter: [['html', { open: 'never' }]],

use: {
/* URL of Medusa Storefront Staging */
baseURL: 'https://atqaa-medusa-storefront.vercel.app/vn',

/* Only take screenshots and record videos if the test fails */
screenshot: 'only-on-failure',
video: 'retain-on-failure',

/* Enable the Trace Viewer black box feature when retrying */
trace: 'on-first-retry',
},

/* Configure target browsers */
projects: [
{
name: 'chromium',
use: { ...devices['Desktop Chrome'] },
},
{
name: 'firefox',
use: { ...devices['Desktop Firefox'] },
},
],
});