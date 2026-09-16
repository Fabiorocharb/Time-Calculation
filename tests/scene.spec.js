const { test, expect } = require('@playwright/test');
const { pathToFileURL } = require('node:url');
const path = require('node:path');
const url = pathToFileURL(path.resolve(__dirname, '../index.html')).href;

test('gesture and clock animate together and can be paused', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url);
  await expect(page.locator('.time-scene')).toBeVisible();
  const pose = () => page.locator('#scene-arm, #scene-minute-hand, #scene-hour-hand')
    .evaluateAll(nodes => nodes.map(node => node.getAttribute('transform')));
  const start = await pose();
  await expect.poll(pose, { timeout: 6000 }).not.toEqual(start);
  await page.waitForTimeout(2500);
  const moving = await pose();
  moving.forEach((value, index) => expect(value).not.toBe(start[index]));
  await page.getByRole('button', { name: 'Pausar animação' }).click();
  const paused = await pose();
  await page.waitForTimeout(250);
  expect(await pose()).toEqual(paused);
  await page.screenshot({ path: 'test-results/scene-desktop.png', fullPage: true });
  await page.locator('.time-scene__art').screenshot({ path: 'test-results/scene-detail.png' });
  await page.getByRole('button', { name: 'Reproduzir animação' }).click();
  await expect.poll(pose).not.toEqual(paused);
});

test('reduced motion starts paused and mobile scene stays above the form', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(url);
  await expect(page.getByRole('button', { name: 'Reproduzir animação' })).toBeVisible();
  await expect(page.locator('.scene-toggle')).toHaveAttribute('aria-pressed', 'true');
  const before = await page.locator('#scene-arm').getAttribute('transform');
  await page.waitForTimeout(200);
  await expect(page.locator('#scene-arm')).toHaveAttribute('transform', before);
  const scene = await page.locator('.time-scene').boundingBox();
  const form = await page.locator('form').boundingBox();
  expect(scene.y + scene.height).toBeLessThan(form.y);
  await page.screenshot({ path: 'test-results/scene-mobile.png', fullPage: true });
});
