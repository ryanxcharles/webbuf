import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    browser: {
      enabled: false,    // Enable browser testing
      provider: 'playwright',  // You can specify 'playwright' or 'webdriver'
      name: 'chromium',   // You can specify 'chrome' or 'firefox'
      headless: true,   // Set to false if you want to see the browser window
    },
  },
});
