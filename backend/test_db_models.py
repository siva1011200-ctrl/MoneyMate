#!/usr/bin/env python3
"""Test database model changes"""

import sys
sys.path.insert(0, '.')

from app.models import Base, Income, Expense, Budget, SavingsGoal, User
from app.database import engine
from sqlalchemy import inspect

print("=" * 60)
print("PHASE 2 DATABASE MODEL TESTS")
print("=" * 60)

# Test 1: Check model imports and structure
print("\n1. Testing model imports and structure...")
try:
    print(f"✓ Income model: amount field type = {Income.amount.type}")
    print(f"✓ Income model: date field type = {Income.date.type}")
    print(f"✓ Expense model: amount field type = {Expense.amount.type}")
    print(f"✓ Expense model: date field type = {Expense.date.type}")
    print(f"✓ Budget model: limit_amount field type = {Budget.limit_amount.type}")
    print(f"✓ SavingsGoal model: target field type = {SavingsGoal.target.type}")
    print(f"✓ SavingsGoal model: saved field type = {SavingsGoal.saved.type}")
except Exception as e:
    print(f"✗ Model import failed: {e}")

# Test 2: Check table constraints
print("\n2. Testing table constraints...")
try:
    inspector = inspect(engine)
    
    # Check Income table
    income_columns = {col['name']: col for col in inspector.get_columns('income')}
    print(f"✓ Income table has {len(income_columns)} columns")
    print(f"  - amount: {income_columns.get('amount', {}).get('type', 'NOT FOUND')}")
    print(f"  - date: {income_columns.get('date', {}).get('type', 'NOT FOUND')}")
    
    # Check Expense table
    expense_columns = {col['name']: col for col in inspector.get_columns('expenses')}
    print(f"✓ Expense table has {len(expense_columns)} columns")
    print(f"  - amount: {expense_columns.get('amount', {}).get('type', 'NOT FOUND')}")
    print(f"  - date: {expense_columns.get('date', {}).get('type', 'NOT FOUND')}")
    
    # Check Budget table
    budget_columns = {col['name']: col for col in inspector.get_columns('budgets')}
    print(f"✓ Budget table has {len(budget_columns)} columns")
    print(f"  - limit_amount: {budget_columns.get('limit_amount', {}).get('type', 'NOT FOUND')}")
    
    # Check SavingsGoal table
    savings_columns = {col['name']: col for col in inspector.get_columns('savings_goals')}
    print(f"✓ SavingsGoal table has {len(savings_columns)} columns")
    print(f"  - target: {savings_columns.get('target', {}).get('type', 'NOT FOUND')}")
    print(f"  - saved: {savings_columns.get('saved', {}).get('type', 'NOT FOUND')}")
    
except Exception as e:
    print(f"✗ Constraint check failed: {e}")

# Test 3: Check indexes
print("\n3. Testing database indexes...")
try:
    income_indexes = [idx['name'] for idx in inspector.get_indexes('income')]
    print(f"✓ Income indexes: {income_indexes}")
    
    expense_indexes = [idx['name'] for idx in inspector.get_indexes('expenses')]
    print(f"✓ Expense indexes: {expense_indexes}")
    
    budget_indexes = [idx['name'] for idx in inspector.get_indexes('budgets')]
    print(f"✓ Budget indexes: {budget_indexes}")
    
    savings_indexes = [idx['name'] for idx in inspector.get_indexes('savings_goals')]
    print(f"✓ SavingsGoal indexes: {savings_indexes}")
    
except Exception as e:
    print(f"✗ Index check failed: {e}")

# Test 4: Check check constraints
print("\n4. Testing CHECK constraints...")
try:
    budget_checks = [ck['name'] for ck in inspector.get_check_constraints('budgets')]
    print(f"✓ Budget CHECK constraints: {budget_checks}")
    
    savings_checks = [ck['name'] for ck in inspector.get_check_constraints('savings_goals')]
    print(f"✓ SavingsGoal CHECK constraints: {savings_checks}")
    
    income_checks = [ck['name'] for ck in inspector.get_check_constraints('income')]
    print(f"✓ Income CHECK constraints: {income_checks}")
    
    expense_checks = [ck['name'] for ck in inspector.get_check_constraints('expenses')]
    print(f"✓ Expense CHECK constraints: {expense_checks}")
    
except Exception as e:
    print(f"✗ CHECK constraint check failed: {e}")

print("\n" + "=" * 60)
print("DATABASE MODEL TESTS COMPLETE")
print("=" * 60)
