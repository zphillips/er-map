import { test, expect, Page } from '@playwright/test';
import config from './fixtures/config.json' assert { type: 'json' };
import subjects from './fixtures/subjects.json' assert { type: 'json' };
import tracks from './fixtures/tracks.json' assert { type: 'json' };

// Regression net for the CURRENT app (PR 1.1). These journeys assert behavior through
// the UI, so they survive the Vite/React 19/MapLibre overhaul. All network is mocked so
// the suite is deterministic and independent of the live PADAS server.
test.beforeEach(async ({ page }) => {
  await page.route('**/config/config.json', (route) => route.fulfill({ json: config }));
  await page.route('**/api/v1.0/subjects', (route) => route.fulfill({ json: subjects }));
  await page.route('**/tracks', (route) => route.fulfill({ json: tracks }));
});

// Open the legend and wait for subjects (fetched inside the Mapbox "load" event) to render.
async function openLegendWithSubjects(page: Page) {
  await page.goto('/');
  await page.locator('#legend-open-button').click();
  await expect(page.getByText('Zola')).toBeVisible({ timeout: 20_000 });
}

// Wrap window.GlobalMap.flyTo so we can assert it was called (and with what) without
// depending on pixel-level WebGL rendering.
async function spyFlyTo(page: Page) {
  await page.evaluate(() => {
    const m = (window as any).GlobalMap;
    (window as any).__flyTo = null;
    const orig = m.flyTo.bind(m);
    m.flyTo = (opts: any) => { (window as any).__flyTo = opts; return orig(opts); };
  });
}

test('1. app loads: static controls render', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#legend-open-button')).toBeVisible();
  await expect(page.locator('#tips-button-container')).toBeVisible();
});

test('2. legend populates from subjects', async ({ page }) => {
  await openLegendWithSubjects(page);
  await expect(page.getByText('Mara')).toBeVisible();
});

test('3. clicking a subject name opens its story panel', async ({ page }) => {
  await openLegendWithSubjects(page);
  await page.locator('#Zola').first().click();
  await expect(page.getByText('Back')).toBeVisible();
  await expect(page.getByText(/test giraffe/i)).toBeVisible();
});

test('4. toggling the track button requests that subject\'s tracks', async ({ page }) => {
  await openLegendWithSubjects(page);
  const trackRequest = page.waitForRequest('**/tracks');
  await page.locator('#subject-track-button').first().click();
  await trackRequest; // resolves only if the track-display flow fired
});

test('5. location button flies the map to the subject\'s coordinates', async ({ page }) => {
  await openLegendWithSubjects(page);
  await spyFlyTo(page);
  await page.locator('#subject-location-button').first().click();
  const opts = await page.evaluate(() => (window as any).__flyTo);
  expect(opts).not.toBeNull();
  expect(opts.center).toEqual([0.01, 0.01]);
});

test('6. help tips open and close', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Helpful Tips')).toBeHidden();
  await page.locator('#tips-button-container').click();
  await expect(page.getByText('Helpful Tips')).toBeVisible();
  await page.locator('#close-icon').click();
  await expect(page.getByText('Helpful Tips')).toBeHidden();
});

test('7. Alt+R hotkey resets the map orientation', async ({ page }) => {
  await openLegendWithSubjects(page);
  await spyFlyTo(page);
  // The hotkey handler lives on #map-container (onKeyDown). Dispatch native keydowns
  // with the keyCodes the app checks for: Alt (18) then R (82).
  await page.evaluate(() => {
    const el = document.getElementById('map-container')!;
    const fire = (keyCode: number) => {
      const ev = new KeyboardEvent('keydown', { bubbles: true });
      Object.defineProperty(ev, 'keyCode', { get: () => keyCode });
      el.dispatchEvent(ev);
    };
    fire(18);
    fire(82);
  });
  const opts = await page.evaluate(() => (window as any).__flyTo);
  expect(opts).not.toBeNull();
  expect(opts.bearing).toBe(0);
});
