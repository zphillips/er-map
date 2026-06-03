import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    // ⚠️ REMOVE-AFTER-VITE (overhaul Pass 1.2): webpack 4 (Neutrino 9) crashes on
    // Node 17+ with ERR_OSSL_EVP_UNSUPPORTED. --openssl-legacy-provider props up the
    // legacy dev server just long enough to run this regression net. Once the app
    // builds on Vite, delete the NODE_OPTIONS prefix below (ideally this whole flag).
    // Tracking: workspace/design-docs/2026-06-03-app-overhaul-design.md (Pass 1.2).
    command: 'NODE_OPTIONS=--openssl-legacy-provider npx webpack-dev-server --mode development --host localhost --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
