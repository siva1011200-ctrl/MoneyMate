#!/bin/bash

echo "=== MoneyMate Part 3: CRUD Testing ==="
echo ""

# Start the frontend static server
echo "Starting static frontend server on port 8080..."
python -m http.server 8080 --directory dist > serve.log 2>&1 &
echo "Server started."
echo ""

# Navigate to tests directory
echo "Changing to tests directory..."
cd tests

# List available test files
echo "Available test files:"
ls -la browser/
echo ""

# List specific test files content to verify
echo "Content of browser/crud.spec.ts:"
cat browser/crud.spec.ts | head -50
echo "..."

echo ""
echo "=== SETUP CHECK ==="
echo ""
echo "Frontend server running on http://localhost:8080"
echo "Backend API available on http://localhost:8000"
echo ""
echo "Running Playwright tests for CRUD operations..."
echo ""

# Run Playwright tests using the correct path
npx playwright test --reporter=line
echo ""
echo "=== Tests completed ==="

# Get test results
echo "Checking for test results..."
if [ -d "test-results" ]; then
    echo "Test results directory exists:"
    ls -la test-results/ || true
fi

# Check for any .png screenshots from failed tests
echo ""
echo "Looking for test failure screenshots..."
find test-results -name "*.png" -type f 2>/dev/null | head -5
echo ""
echo "=== All checks complete ==="

# Display summary
echo ""
echo "=== SUMMARY ==="
echo "Playwright tests have been configured to test:")
echo ""
echo "  - Income CRUD operations"
echo "  - Expense CRUD operations"
echo "  - Budget CRUD operations"
echo "  - Savings Goals CRUD operations"
echo "  - Profile CRUD operations"
echo ""
echo "All tests authenticate as existing user testuser@example.com (set up in Part 2)"
echo ""
echo "To run interactive tests:")
echo "  npx playwright test --ui"
echo ""
echo "To run tests with HTML report:"
echo "  npx playwright test --reporter=html"
echo ""
echo "=== End of Part 3 ==="