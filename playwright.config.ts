import { defineConfig, devices } from '@playwright/test';
import { environment } from '@support/env-config';

const VIEW_PORT = { width: 1440, height: 900 };

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 90000,
  expect: { timeout: 15000 },
  use: {
    headless: true,
    baseURL: environment().baseUrl,
    actionTimeout: 15000,
    navigationTimeout: 30000,
    viewport: VIEW_PORT,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'Chrome E2E tests',
      use: {
        ...devices['Desktop Chrome'],
        viewport: VIEW_PORT,
      },
    },
  ],
});
