const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');

const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;
const sizes = [[320, 568], [360, 640], [390, 844], [568, 320], [667, 375],
  [768, 1024], [1024, 768], [1280, 720], [1440, 900], [1920, 1080], [2560, 1440]];

for (const [width, height] of sizes) {
  test(`layout ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto(url);
    await page.evaluate(() => document.fonts.ready);
    const checkLayout = async () => page.evaluate(() => {
      const rect = selector => document.querySelector(selector).getBoundingClientRect();
      const form = rect('form');
      return {
        overflow: document.documentElement.scrollWidth > innerWidth,
        outside: [...document.querySelectorAll('body *')].filter(el => {
          if (el instanceof SVGElement) return false; // Artwork is cropped by its SVG viewport.
          const r = el.getBoundingClientRect();
          return r.width && (r.left < -1 || r.right > innerWidth + 1);
        }).map(el => el.id || el.tagName),
        fieldsFit: [...document.querySelectorAll('.day')].every(el => {
          const r = el.getBoundingClientRect();
          return r.left >= form.left && r.right <= form.right && r.height >= 44;
        }),
        heroFits: rect('.animated-box').bottom <= rect('#principal').bottom,
        sectionsSeparate: rect('.container2').top >= rect('.animated-box').bottom,
        footerSeparate: rect('footer').top >= rect('.container2').bottom,
        imagesLoaded: [...document.images].every(img => img.complete && img.naturalWidth > 0),
      };
    });
    const expected = { overflow: false, outside: [], fieldsFit: true,
      heroFits: true, sectionsSeparate: true, footerSeparate: true, imagesLoaded: true };
    await expect.poll(checkLayout).toEqual(expected);
    for (const [id, value] of Object.entries({ dia: '24', sono: '8', trabalho: '8', almoco: '1' })) {
      await page.locator(`#${id}`).fill(value);
    }
    await page.locator('#enviar').click();
    await expect(page.locator('#resultado')).toHaveText('7');
    await page.screenshot({ path: `test-results/layout-${width}x${height}.png`, fullPage: true });
    // Increased text size must also remain in the document flow.
    await page.evaluate(() => document.documentElement.style.fontSize = '32px');
    await expect.poll(checkLayout).toEqual(expected);
  });
}
