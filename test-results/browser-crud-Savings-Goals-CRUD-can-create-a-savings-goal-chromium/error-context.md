# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: browser\crud.spec.ts >> Savings Goals CRUD >> can create a savings goal
- Location: tests\browser\crud.spec.ts:233:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Emergency Fund')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Emergency Fund')

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
  - text: Hi, Savings CRUD Tester
  - button "🌙 Dark"
  - button "Logout"
- main:
  - heading "Savings Goals" [level=1]
  - heading "Add Savings Goal" [level=2]
  - textbox "Savings Goal Name": Emergency Fund
  - spinbutton: "5000.00"
  - spinbutton: "500.00"
  - button "Add Savings Goal"
- contentinfo: © 2026 MoneyMate
```

# Test source

```ts
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
  223 | 
  224 | test.describe("Savings Goals CRUD", () => {
  225 |   test.beforeEach(async ({ page }) => {
  226 |     await registerUser(page, "Savings CRUD Tester", `savingscrud${Date.now()}@example.com`, TEST_PASSWORD);
  227 |   });
  228 | 
  229 |   test.afterEach(async ({ page }) => {
  230 |     await logoutUser(page);
  231 |   });
  232 | 
  233 |   test("can create a savings goal", async ({ page }) => {
  234 |     await page.goto("/savings-goals");
  235 |     await page.fill('input[name="goal"]', "Emergency Fund");
  236 |     await page.fill('input[name="target"]', "5000.00");
  237 |     await page.fill('input[name="saved"]', "500.00");
  238 |     await page.click('button:has-text("Add Savings Goal")');
  239 |     await page.waitForTimeout(2000);
> 240 |     await expect(page.locator("text=Emergency Fund")).toBeVisible();
      |                                                       ^ Error: expect(locator).toBeVisible() failed
  241 |   });
  242 | 
  243 |   test("shows progress percentage", async ({ page }) => {
  244 |     await page.goto("/savings-goals");
  245 |     await page.fill('input[name="goal"]', "Vacation Fund");
  246 |     await page.fill('input[name="target"]', "2000.00");
  247 |     await page.fill('input[name="saved"]', "1000.00");
  248 |     await page.click('button:has-text("Add Savings Goal")');
  249 |     await page.waitForTimeout(2000);
  250 |     await expect(page.locator("text=Vacation Fund")).toBeVisible();
  251 |   });
  252 | 
  253 |   test("persists savings goals after page reload", async ({ page }) => {
  254 |     await page.goto("/savings-goals");
  255 |     await page.fill('input[name="goal"]', "House Down Payment");
  256 |     await page.fill('input[name="target"]', "10000.00");
  257 |     await page.fill('input[name="saved"]', "2500.00");
  258 |     await page.click('button:has-text("Add Savings Goal")');
  259 |     await page.waitForTimeout(2000);
  260 | 
  261 |     await page.reload();
  262 |     await page.waitForLoadState("networkidle");
  263 |     await expect(page.locator("text=House Down Payment")).toBeVisible();
  264 |   });
  265 | });
  266 | 
  267 | test.describe("Profile CRUD", () => {
  268 |   test.beforeEach(async ({ page }) => {
  269 |     await registerUser(page, "Profile CRUD Tester", `profilecrud${Date.now()}@example.com`, TEST_PASSWORD);
  270 |   });
  271 | 
  272 |   test.afterEach(async ({ page }) => {
  273 |     await logoutUser(page);
  274 |   });
  275 | 
  276 |   test("can load profile page with user data", async ({ page }) => {
  277 |     await page.goto("/profile");
  278 |     await page.waitForLoadState("networkidle");
  279 |     await expect(page.locator('h1:has-text("Profile")')).toBeVisible();
  280 |     await expect(page.locator('input[id="name"]')).toBeVisible();
  281 |     await expect(page.locator('input[id="email"]')).toBeVisible();
  282 |   });
  283 | 
  284 |   test("can update profile name", async ({ page }) => {
  285 |     await page.goto("/profile");
  286 |     await page.click('button:has-text("Edit Profile")');
  287 |     await page.fill('input[id="name"]', "Updated Profile Name");
  288 |     await page.click('button:has-text("Save Profile")');
  289 |     await page.waitForTimeout(1000);
  290 |     // Check that the input field has the updated value
  291 |     await expect(page.locator('input[id="name"]')).toHaveValue("Updated Profile Name");
  292 |   });
  293 | 
  294 |   test("can update profile email", async ({ page }) => {
  295 |     await page.goto("/profile");
  296 |     await page.click('button:has-text("Edit Profile")');
  297 |     await page.fill('input[id="email"]', `updated${Date.now()}@example.com`);
  298 |     await page.click('button:has-text("Save Profile")');
  299 |     await page.waitForTimeout(1000);
  300 |     const currentUrl = page.url();
  301 |     expect(currentUrl).not.toContain("/login");
  302 |   });
  303 | 
  304 |   test("reflects profile updates across pages", async ({ page }) => {
  305 |     await page.goto("/profile");
  306 |     await page.click('button:has-text("Edit Profile")');
  307 |     await page.fill('input[id="name"]', "New Name");
  308 |     await page.click('button:has-text("Save Profile")');
  309 |     await page.waitForTimeout(1000);
  310 | 
  311 |     await page.goto("/dashboard");
  312 |     await page.waitForURL(/\/dashboard/, { timeout: 5000 });
  313 |     // Check for the greeting with the new name
  314 |     await expect(page.locator('text=Hi, New Name')).toBeVisible();
  315 |   });
  316 | });
```