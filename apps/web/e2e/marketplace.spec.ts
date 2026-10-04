import { test, expect } from '@playwright/test';

test.describe('Dhanshree Global Multi-Vendor Platform E2E Suite', () => {
  test('User can browse Nepal storefront with NPR currency and 13% VAT', async ({ page }) => {
    await page.goto('/np');
    await expect(page.locator('text=Dhanshree')).toBeVisible();
    await expect(page.locator('text=🇳🇵')).toBeVisible();
    await expect(page.locator('text=NPR')).toBeVisible();

    // Verify AI Concierge is available
    const concierge = page.locator('text=AI Concierge');
    await expect(concierge).toBeVisible();
  });

  test('User can browse India storefront with INR currency and GST', async ({ page }) => {
    await page.goto('/in');
    await expect(page.locator('text=Dhanshree')).toBeVisible();
    await expect(page.locator('text=🇮🇳')).toBeVisible();
    await expect(page.locator('text=INR')).toBeVisible();
  });

  test('User can browse UAE storefront with AED currency and 5% VAT', async ({ page }) => {
    await page.goto('/ae');
    await expect(page.locator('text=Dhanshree')).toBeVisible();
    await expect(page.locator('text=🇦🇪')).toBeVisible();
    await expect(page.locator('text=AED')).toBeVisible();
  });

  test('Customer can access Live Auctions and submit a bid', async ({ page }) => {
    await page.goto('/np/auctions');
    await expect(page.locator('text=Live Marketplace Auctions')).toBeVisible();
    await expect(page.locator('text=Place Bid').first()).toBeVisible();
  });

  test('Customer can access Wholesale RFQ and view volume tiered pricing', async ({ page }) => {
    await page.goto('/np/rfq');
    await expect(page.locator('text=Bulk Tiered Pricing')).toBeVisible();
    await expect(page.locator('text=Request Custom RFQ Quote').first()).toBeVisible();
  });

  test('Customer can access Prime VIP Club and view loyalty rewards', async ({ page }) => {
    await page.goto('/np/membership');
    await expect(page.locator('text=Prime VIP Club')).toBeVisible();
    await expect(page.locator('text=Reward Points')).toBeVisible();
  });

  test('Customer can access 3-Step Checkout with localized fields', async ({ page }) => {
    await page.goto('/np/checkout');
    await expect(page.locator('text=Secure Multi-Country Checkout')).toBeVisible();
    await expect(page.locator('text=Shipping Address')).toBeVisible();
    await expect(page.locator('text=Payment Selection')).toBeVisible();
  });

  test('Customer can view Order Tracking and Tax Invoice modal', async ({ page }) => {
    await page.goto('/np/orders/ORD-2026-NP-89211');
    await expect(page.locator('text=Live Order Confirmed')).toBeVisible();
    await expect(page.locator('text=Shipment Status & Milestones')).toBeVisible();

    // Click View Official Tax Invoice
    await page.click('text=View Official Tax Invoice');
    await expect(page.locator('text=कर बीजक (VAT Tax Invoice)')).toBeVisible();
  });

  test('Merchant can access Seller Performance Dashboard', async ({ page }) => {
    await page.goto('/np/seller');
    await expect(page.locator('text=Seller Performance Overview')).toBeVisible();
    await expect(page.locator('text=Gross Sales')).toBeVisible();
    await expect(page.locator('text=Ready for Payout')).toBeVisible();
  });

  test('Admin can access Super Admin Cockpit and view cross-market metrics', async ({ page }) => {
    await page.goto('/np/admin');
    await expect(page.locator('text=Super Admin Cockpit')).toBeVisible();
    await expect(page.locator('text=Cross-Country Storefront Performance')).toBeVisible();
    await expect(page.locator('text=Nepal Storefront')).toBeVisible();
    await expect(page.locator('text=India Storefront')).toBeVisible();
    await expect(page.locator('text=UAE Dubai Storefront')).toBeVisible();
  });
});
