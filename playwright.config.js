const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { browserName: 'chromium', channel: 'msedge', headless: true },
});
