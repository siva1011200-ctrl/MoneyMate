import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "line",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
    // Set environment variable for tests
    contextOptions: {
      javaScriptEnabled: true,
    },
    // Inject environment variables for the browser
    javaScriptEnabled: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        // Set environment variables for the browser context
        launchOptions: {
          args: ['--disable-web-security'],
        },
        contextOptions: {
          javaScriptEnabled: true,
        },
      },
    },
  ],
  webServer: {
    command: 'cross-env VITE_API_URL=http://localhost:8000 npm run dev',
    port: 5173,
    timeout: 120000,
  },
});