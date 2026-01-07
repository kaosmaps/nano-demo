#!/usr/bin/env node
/**
 * Screenshot capture script for demo apps
 * Uses Playwright to capture authenticated demo pages
 */

import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPS = [
  { id: 'sk', url: 'https://demo.kaosmaps.com/sk/', auth: 'demo:Demo.sk.2025' },
  { id: 'heller', url: 'https://demo.kaosmaps.com/heller/', auth: 'demo:Demo.heller.2025' },
  { id: 'kuyuy', url: 'https://demo.kaosmaps.com/kuyuy/', auth: 'demo:Demo.kuyuy.2025' },
];

async function captureScreenshot(browser, app) {
  const [username, password] = app.auth.split(':');
  const context = await browser.newContext({
    httpCredentials: { username, password },
    viewport: { width: 1440, height: 900 },
  });

  const page = await context.newPage();

  console.log(`Capturing ${app.id}...`);

  try {
    await page.goto(app.url, { waitUntil: 'networkidle', timeout: 60000 });
    // Extra wait for React hydration and animations
    await page.waitForTimeout(5000);
    // Wait for body to have content
    await page.waitForSelector('body *', { timeout: 10000 }).catch(() => {});

    const outputPath = path.join(__dirname, '..', 'public', 'demos', `${app.id}-preview.png`);
    await page.screenshot({ path: outputPath, fullPage: false });

    const stats = fs.statSync(outputPath);
    console.log(`  ✓ ${app.id}-preview.png (${Math.round(stats.size / 1024)}KB)`);

    return { success: true, size: stats.size };
  } catch (error) {
    console.error(`  ✗ ${app.id}: ${error.message}`);
    return { success: false, error: error.message };
  } finally {
    await context.close();
  }
}

async function main() {
  console.log('Starting screenshot capture...\n');

  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const app of APPS) {
    const result = await captureScreenshot(browser, app);
    results.push({ app: app.id, ...result });
  }

  await browser.close();

  console.log('\n=== Summary ===');
  const successful = results.filter(r => r.success && r.size > 50000);
  const failed = results.filter(r => !r.success || r.size <= 50000);

  console.log(`Successful: ${successful.length}`);
  console.log(`Failed/Blank: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed apps:');
    failed.forEach(r => console.log(`  - ${r.app}: ${r.error || 'Screenshot too small (blank page?)'}`));
    process.exit(1);
  }
}

main().catch(console.error);
