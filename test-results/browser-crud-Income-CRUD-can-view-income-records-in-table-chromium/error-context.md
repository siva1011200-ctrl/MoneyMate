# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser\crud.spec.ts >> Income CRUD >> can view income records in table
- Location: tests\browser\crud.spec.ts:49:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Income From Test')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Income From Test')

```

```yaml
- complementary:
  - heading "💰 MoneyMate" [level=1]
  - navigation:
    - link "Dashboard":
      - /url: /dashboard
    - link "Income":
      - /url: /income
    - link "Expenses":
      - /url: /expenses
    - link "Budget":
      - /url: /budget
    - link "Savings Goals":
      - /url: /savings-goals
    - link "Analytics":
      - /url: /analytics
    - link "Transactions":
      - /url: /transactions
    - link "Profile":
      - /url: /profile
- navigation:
  - link "MoneyMate":
    - /url: /dashboard
    - heading "MoneyMate" [level=2]
  - text: Hi, CRUD Tester
  - button "🌙 Dark"
  - button "Logout"
- main:
  - heading "Income Management" [level=1]
  - heading "Income Records" [level=2]
  - table:
    - rowgroup:
      - row "Date Source Amount Description":
        - columnheader "Date"
        - columnheader "Source"
        - columnheader "Amount"
        - columnheader "Description"
    - rowgroup
  - heading "Add Income" [level=2]
  - textbox "Income Source": Income From Test
  - textbox "Amount": "500.00"
  - textbox "Date": 2026-07-10
  - textbox "Description": Table test income
  - button "Add Income"
- contentinfo: © 2026 MoneyMate
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | const TEST_USER_EMAIL = `crudtest${Date.now()}@example.com`;
  4   | const TEST_PASSWORD = "TestPass123!";
  5   | 
  6   | async function registerUser(page: any, name: string, email: string, password: string, type: string = "student") {
  7   |   await page.goto("/register");
  8   |   await page.fill('input[name="name"]', name);
  9   |   await page.fill('input[name="email"]', email);
  10  |   await page.fill('input[name="password"]', password);
  11  |   await page.selectOption('select[name="type"]', type);
  12  |   await page.click('button[type="submit"]');
  13  |   await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  14  | }
  15  | 
  16  | async function loginUser(page: any, email: string, password: string) {
  17  |   await page.goto("/login");
  18  |   await page.fill('input[type="email"]', email);
  19  |   await page.fill('input[type="password"]', password);
  20  |   await page.click('button[type="submit"]');
  21  |   await page.waitForURL(/\/dashboard/, { timeout: 10000 });
  22  | }
  23  | 
  24  | async function logoutUser(page: any) {
  25  |   await page.click("button:has-text('Logout')");
  26  |   await page.waitForURL(/\/login/, { timeout: 5000 });
  27  | }
  28  | 
  29  | test.describe("Income CRUD", () => {
  30  |   test.beforeEach(async ({ page }) => {
  31  |     await registerUser(page, "CRUD Tester", TEST_USER_EMAIL, TEST_PASSWORD);
  32  |   });
  33  | 
  34  |   test.afterEach(async ({ page }) => {
  35  |     await logoutUser(page);
  36  |   });
  37  | 
  38  |   test("can create income via form", async ({ page }) => {
  39  |     await page.goto("/income");
  40  |     await page.fill('input[name="source"]', "Test Income Source");
  41  |     await page.fill('input[name="amount"]', "1500.00");
  42  |     await page.fill('input[name="date"]', "2026-07-01");
  43  |     await page.fill('textarea[name="description"]', "Test income description");
  44  |     await page.click('button:has-text("Add Income")');
  45  |     await page.waitForTimeout(2000);
  46  |     await expect(page.locator("text=Test Income Source")).toBeVisible();
  47  |   });
  48  | 
  49  |   test("can view income records in table", async ({ page }) => {
  50  |     await page.goto("/income");
  51  |     await page.fill('input[name="source"]', "Income From Test");
  52  |     await page.fill('input[name="amount"]', "500.00");
  53  |     await page.fill('input[name="date"]', "2026-07-10");
  54  |     await page.fill('textarea[name="description"]', "Table test income");
  55  |     await page.click('button:has-text("Add Income")');
  56  |     await page.waitForTimeout(2000);
> 57  |     await expect(page.locator("text=Income From Test")).toBeVisible();
      |                                                         ^ Error: expect(locator).toBeVisible() failed
  58  |     await expect(page.locator("text=500")).toBeVisible();
  59  |   });
  60  | 
  61  |   test("shows validation error on negative amount", async ({ page }) => {
  62  |     await page.goto("/income");
  63  |     await page.fill('input[name="source"]', "Bad Income");
  64  |     await page.fill('input[name="amount"]', "-100");
  65  |     await page.fill('input[name="date"]', "2026-07-10");
  66  |     await page.click('button:has-text("Add Income")');
  67  |     await page.waitForTimeout(500);
  68  |     // Check if the income was NOT added (validation worked)
  69  |     const incomeCount = await page.locator('table tbody tr').count();
  70  |     expect(incomeCount).toBe(0);
  71  |   });
  72  | 
  73  |   test("shows validation error on empty source", async ({ page }) => {
  74  |     await page.goto("/income");
  75  |     await page.fill('input[name="amount"]', "100");
  76  |     await page.fill('input[name="date"]', "2026-07-10");
  77  |     await page.click('button:has-text("Add Income")');
  78  |     await page.waitForTimeout(500);
  79  |     const result = await page.evaluate(() => localStorage.getItem("user"));
  80  |     expect(result).toBeTruthy();
  81  |   });
  82  | 
  83  |   test.skip("persists income after page reload", async ({ page }) => {
  84  |     // Skipped due to authentication state issues during logout
  85  |     await page.goto("/income");
  86  |     await page.fill('input[name="source"]', "Persistent Income");
  87  |     await page.fill('input[name="amount"]', "1000.00");
  88  |     await page.fill('input[name="date"]', "2026-07-15");
  89  |     await page.click('button:has-text("Add Income")');
  90  |     await page.waitForTimeout(1000);
  91  | 
  92  |     // Navigate away and back to check persistence
  93  |     await page.goto("/dashboard");
  94  |     await page.waitForLoadState("networkidle");
  95  |     await page.goto("/income");
  96  |     await page.waitForLoadState("networkidle");
  97  |     // Check that income data persists (row count should be > 0)
  98  |     const rowCount = await page.locator('table tbody tr').count();
  99  |     expect(rowCount).toBeGreaterThan(0);
  100 |   });
  101 | });
  102 | 
  103 | test.describe("Expense CRUD", () => {
  104 |   test.beforeEach(async ({ page }) => {
  105 |     await registerUser(page, "Expense CRUD Tester", `expensecrud${Date.now()}@example.com`, TEST_PASSWORD);
  106 |   });
  107 | 
  108 |   test.afterEach(async ({ page }) => {
  109 |     await logoutUser(page);
  110 |   });
  111 | 
  112 |   test("can create expense via form", async ({ page }) => {
  113 |     await page.goto("/expenses");
  114 |     await page.fill('input[id="category"]', "Groceries");
  115 |     await page.fill('input[id="amount"]', "75.50");
  116 |     await page.fill('input[id="date"]', "2026-07-10");
  117 |     await page.fill('textarea[id="description"]', "Weekly groceries");
  118 |     await page.click('button:has-text("Add Expense")');
  119 |     await page.waitForTimeout(2000);
  120 |     // Check that a row was added to the table
  121 |     const rowCount = await page.locator('table tbody tr').count();
  122 |     expect(rowCount).toBeGreaterThan(0);
  123 |   });
  124 | 
  125 |   test("can view expense records in table", async ({ page }) => {
  126 |     await page.goto("/expenses");
  127 |     await page.fill('input[id="category"]', "Utilities");
  128 |     await page.fill('input[id="amount"]', "120.00");
  129 |     await page.fill('input[id="date"]', "2026-07-12");
  130 |     await page.fill('textarea[id="description"]', "Electric bill");
  131 |     await page.click('button:has-text("Add Expense")');
  132 |     await page.waitForTimeout(3000);
  133 |     await expect(page.locator("text=Utilities")).toBeVisible();
  134 |     await expect(page.locator("text=120")).toBeVisible();
  135 |   });
  136 | 
  137 |   test("shows validation error on negative amount", async ({ page }) => {
  138 |     await page.goto("/expenses");
  139 |     await page.fill('input[id="category"]', "Test Expense");
  140 |     await page.fill('input[id="amount"]', "-50");
  141 |     await page.fill('input[id="date"]', "2026-07-10");
  142 |     await page.click('button:has-text("Add Expense")');
  143 |     await page.waitForTimeout(500);
  144 |     // Check if the expense was NOT added (validation worked)
  145 |     const expenseCount = await page.locator('table tbody tr').count();
  146 |     expect(expenseCount).toBe(0);
  147 |   });
  148 | 
  149 |   test("persists expense after page reload", async ({ page }) => {
  150 |     await page.goto("/expenses");
  151 |     await page.fill('input[id="category"]', "Transport");
  152 |     await page.fill('input[id="amount"]', "30.00");
  153 |     await page.fill('input[id="date"]', "2026-07-20");
  154 |     await page.fill('textarea[id="description"]', "Bus fare");
  155 |     await page.click('button:has-text("Add Expense")');
  156 |     await page.waitForTimeout(3000);
  157 | 
```