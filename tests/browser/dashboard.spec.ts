import { test, expect } from "@playwright/test";

const LOGIN_SELECTOR = 'input[type="email"]';

const login = async (page: any) => {
  await page.goto("/login");
  await page.fill(LOGIN_SELECTOR, "testuser@example.com");
  await page.fill('input[type="password"]', "TestPass123!");
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
};

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("displays user greeting", async ({ page }) => {
    await expect(page.locator("text=Test User 👋")).toBeVisible();
  });

  test("shows financial statistics cards", async ({ page }) => {
    await expect(page.locator("text=Total Income")).toBeVisible();
    await expect(page.locator("text=Total Expenses")).toBeVisible();
    await expect(page.locator("text=Total Savings")).toBeVisible();
    await expect(page.locator("text=Savings Percentage")).toBeVisible();
  });

  test("shows monthly summary section", async ({ page }) => {
    await expect(page.locator("text=Monthly Summary")).toBeVisible();
  });

  test("shows recent transactions table", async ({ page }) => {
    await expect(page.locator("text=Recent Transactions")).toBeVisible();
  });

  test("renders charts correctly", async ({ page }) => {
    await page.goto("/analytics");
    await page.waitForTimeout(1000);
    await expect(page.locator("text=Financial Analytics")).toBeVisible();
    await expect(page.locator("text=Income vs Expense")).toBeVisible();
    await expect(page.locator("text=Savings Growth")).toBeVisible();
    await expect(page.locator("text=Expense Categories")).toBeVisible();
  });
});

test.describe("Navigation", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test("can navigate to Income page", async ({ page }) => {
    await page.click('a[href="/income"]');
    await page.waitForURL(/\/income/, { timeout: 5000 });
    await expect(page.locator("text=Income Management")).toBeVisible();
  });

  test("can navigate to Expenses page", async ({ page }) => {
    await page.click('a[href="/expenses"]');
    await page.waitForURL(/\/expenses/, { timeout: 5000 });
    await expect(page.locator("text=Expense Management")).toBeVisible();
  });

  test("can navigate to Budget page", async ({ page }) => {
    await page.click('a[href="/budget"]');
    await page.waitForURL(/\/budget/, { timeout: 5000 });
    await expect(page.locator("text=Budget Planner")).toBeVisible();
  });

  test("can navigate to Savings Goals page", async ({ page }) => {
    await page.click('a[href="/savings-goals"]');
    await page.waitForURL(/\/savings-goals/, { timeout: 5000 });
    await expect(page.locator("text=Savings Goals")).toBeVisible();
  });

  test("can navigate to Analytics page", async ({ page }) => {
    await page.click('a[href="/analytics"]');
    await page.waitForURL(/\/analytics/, { timeout: 5000 });
    await expect(page.locator("text=Financial Analytics")).toBeVisible();
  });

  test("can navigate to Transactions page", async ({ page }) => {
    await page.click('a[href="/transactions"]');
    await page.waitForURL(/\/transactions/, { timeout: 5000 });
    await expect(page.locator("text=Transaction History")).toBeVisible();
  });

  test("can navigate to Profile page", async ({ page }) => {
    await page.click('a[href="/profile"]');
    await page.waitForURL(/\/profile/, { timeout: 5000 });
    await expect(page.locator("text=Profile")).toBeVisible();
  });

  test("can navigate back to Dashboard from sidebar", async ({ page }) => {
    await page.click('a[href="/dashboard"]');
    await page.waitForURL(/\/dashboard/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });
});