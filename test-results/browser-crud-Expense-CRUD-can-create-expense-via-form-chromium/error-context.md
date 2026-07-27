# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser\crud.spec.ts >> Expense CRUD >> can create expense via form
- Location: tests\browser\crud.spec.ts:112:3

# Error details

```
Error: expect(received).toBeGreaterThan(expected)

Expected: > 0
Received:   0
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - heading "Welcome Back" [level=1] [ref=e5]
  - generic [ref=e6]:
    - text: Email
    - textbox "Email" [ref=e7]
    - text: Password
    - textbox "Password" [ref=e8]
    - button "Login" [ref=e9]
  - paragraph [ref=e10]:
    - text: Don't have an account?
    - link "Register" [ref=e11] [cursor=pointer]:
      - /url: /register
```

# Test source

```ts
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
  57  |     await expect(page.locator("text=Income From Test")).toBeVisible();
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
> 122 |     expect(rowCount).toBeGreaterThan(0);
      |                      ^ Error: expect(received).toBeGreaterThan(expected)
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
  158 |     await page.reload();
  159 |     await page.waitForLoadState("networkidle");
  160 |     await expect(page.locator("text=Transport")).toBeVisible();
  161 |     await expect(page.locator("text=30")).toBeVisible();
  162 |   });
  163 | });
  164 | 
  165 | test.describe("Budget CRUD", () => {
  166 |   test.beforeEach(async ({ page }) => {
  167 |     await registerUser(page, "Budget CRUD Tester", `budgetcrud${Date.now()}@example.com`, TEST_PASSWORD);
  168 |   });
  169 | 
  170 |   test.afterEach(async ({ page }) => {
  171 |     await logoutUser(page);
  172 |   });
  173 | 
  174 |   test("can create a budget", async ({ page }) => {
  175 |     await page.goto("/budget");
  176 |     await page.fill('input[name="category"]', "Entertainment");
  177 |     await page.fill('input[name="limit"]', "500.00");
  178 |     await page.fill('input[name="month"]', "7");
  179 |     await page.fill('input[name="year"]', "2026");
  180 |     await page.click('button:has-text("Add Budget")');
  181 |     await page.waitForTimeout(2000);
  182 |     await expect(page.locator("text=Entertainment")).toBeVisible();
  183 |   });
  184 | 
  185 |   test("budget progress calculation works", async ({ page }) => {
  186 |     await page.goto("/budget");
  187 |     const limitInput = page.locator('input[name="limit"]');
  188 |     const spentDisplay = page.locator('text=₹0 / ₹500');
  189 |     expect(await spentDisplay.count()).toBeGreaterThanOrEqual(0);
  190 |   });
  191 | 
  192 |   test("persists budget after page reload", async ({ page }) => {
  193 |     await page.goto("/budget");
  194 |     await page.fill('input[name="category"]', "Education");
  195 |     await page.fill('input[name="limit"]', "300.00");
  196 |     await page.fill('input[name="month"]', "7");
  197 |     await page.fill('input[name="year"]', "2026");
  198 |     await page.click('button:has-text("Add Budget")');
  199 |     await page.waitForTimeout(2000);
  200 | 
  201 |     await page.reload();
  202 |     await page.waitForLoadState("networkidle");
  203 |     await expect(page.locator("text=Education")).toBeVisible();
  204 |   });
  205 | 
  206 |   test("can add multiple budget categories", async ({ page }) => {
  207 |     await page.goto("/budget");
  208 |     const categories = ["Rent", "Food", "Transport"];
  209 |     for (const cat of categories) {
  210 |       await page.fill('input[name="category"]', cat);
  211 |       await page.fill('input[name="limit"]', "1000.00");
  212 |       await page.fill('input[name="month"]', "7");
  213 |       await page.fill('input[name="year"]', "2026");
  214 |       await page.click('button:has-text("Add Budget")');
  215 |       await page.waitForTimeout(1000);
  216 |     }
  217 |     await page.waitForTimeout(1000);
  218 |     for (const cat of categories) {
  219 |       await expect(page.locator(`text=${cat}`)).toBeVisible();
  220 |     }
  221 |   });
  222 | });
```