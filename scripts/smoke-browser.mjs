import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseUrl = process.env.HUSIE_BASE_URL ?? 'http://127.0.0.1:3000';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  const response = await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  assert.ok(response, 'The browser did not receive a response from /login.');
  assert.equal(response.status(), 200, `Expected /login HTTP 200, received ${response.status()}.`);
  await page.getByRole('heading', { name: 'Welcome to Husie' }).waitFor({ state: 'visible' });
  await page.getByRole('heading', { name: 'Log in', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('heading', { name: 'Create account' }).waitFor({ state: 'visible' });
  assert.equal(await page.locator('input[type="email"]').count(), 2, 'Expected email fields for login and account creation.');
  assert.equal(await page.locator('input[type="password"]').count(), 2, 'Expected password fields for login and account creation.');
  await page.getByRole('button', { name: 'Log in', exact: true }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Create account', exact: true }).waitFor({ state: 'visible' });
  assert.deepEqual(pageErrors, [], `Browser JavaScript errors: ${pageErrors.join(' | ')}`);
  console.log('PASS: Browser loaded /login with HTTP 200.');
  console.log('PASS: Login and create-account headings, fields, and buttons are visible.');
  console.log('PASS: No uncaught browser JavaScript errors were detected.');
} catch (error) {
  await page.screenshot({ path: '/tmp/husie-browser-failure.png', fullPage: true }).catch(() => {});
  console.error('FAIL: Husie browser smoke test failed.');
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser.close();
}
