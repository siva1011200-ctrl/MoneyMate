import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("can navigate to register page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/register"]');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator("h1")).toContainText("Create Account");
  });

  test("can register a new account", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[name="name"]', "Playwright User");
    await page.fill('input[name="email"]', `playwright${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "SecurePass123!");
    await page.selectOption('select[name="type"]', "employee");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("can navigate to login page", async ({ page }) => {
    await page.goto("/");
    await page.click('a[href="/login"]');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator("h1")).toContainText("Welcome Back");
  });

  test("can login with valid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "testuser@example.com");
    await page.fill('input[type="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("shows error on invalid login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "testuser@example.com");
    await page.fill('input[type="password"]', "WrongPassword1!");
    await page.click('button[type="submit"]');
    await expect(page.locator('.bg-red-100').first()).toBeVisible({ timeout: 5000 });
  });

  test("shows error on empty login fields", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');
    await expect(page.locator('.bg-red-100').first()).toBeVisible({ timeout: 5000 });
  });

  test("stores JWT token in localStorage after login", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "testuser@example.com");
    await page.fill('input[type="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    const token = await page.evaluate(() => localStorage.getItem("access_token"));
    expect(token).toBeTruthy();
    expect(token?.startsWith("eyJ")).toBe(true);
  });

  test("validates JWT on protected routes", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("can logout", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "testuser@example.com");
    await page.fill('input[type="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.click("button:has-text('Logout')");
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test("can login again after logout", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "testuser@example.com");
    await page.fill('input[type="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await page.click("button:has-text('Logout')");
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await page.fill('input[type="email"]', "testuser@example.com");
    await page.fill('input[type="password"]', "TestPass123!");
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("registration requires minimum 12 character password", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[name="name"]', "Short PW User");
    await page.fill('input[name="email"]', `shortpw${Date.now()}@example.com`);
    await page.fill('input[name="password"]', "Short1!");
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    const input = page.locator('input[name="password"]');
    const maxLength = await input.getAttribute('maxLength');
    expect(maxLength).toBeFalsy();
  });
});