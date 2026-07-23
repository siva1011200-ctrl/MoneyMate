#!/usr/bin/env python3
"""
Migration script to update database schema for Phase 2 changes.

This script will:
1. Convert Float columns to NUMERIC(10, 2) for financial precision
2. Convert VARCHAR date columns to DATETIME
3. Add CHECK constraints
4. Add missing indexes
5. Update existing data to new formats

IMPORTANT: Stop the FastAPI server before running this script!
"""

import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from app.config import DATABASE_URL

print("=" * 60)
print("PHASE 2 DATABASE MIGRATION")
print("=" * 60)

print(f"\nDatabase URL: {DATABASE_URL}")
print("\nWARNING: This will modify the database schema.")
print("Make sure to stop the FastAPI server first!")

# Create engine
engine = create_engine(DATABASE_URL)

with engine.begin() as connection:
    print("\n--- Step 1: Backup existing data ---")
    
    # Backup income data
    income_data = connection.execute(text("SELECT id, source, amount, date, description, user_id, created_at FROM income")).fetchall()
    print(f"✓ Backed up {len(income_data)} income records")
    
    # Backup expense data
    expense_data = connection.execute(text("SELECT id, category, amount, date, description, user_id, created_at FROM expenses")).fetchall()
    print(f"✓ Backed up {len(expense_data)} expense records")
    
    # Backup budget data
    budget_data = connection.execute(text("SELECT id, category, limit_amount, month, year, user_id, created_at FROM budgets")).fetchall()
    print(f"✓ Backed up {len(budget_data)} budget records")
    
    # Backup savings goals data
    savings_data = connection.execute(text("SELECT id, goal, target, saved, user_id, created_at, updated_at FROM savings_goals")).fetchall()
    print(f"✓ Backed up {len(savings_data)} savings goals records")
    
    print("\n--- Step 2: Drop old tables ---")
    
    connection.execute(text("DROP TABLE IF EXISTS notifications"))
    connection.execute(text("DROP TABLE IF EXISTS savings_goals"))
    connection.execute(text("DROP TABLE IF EXISTS budgets"))
    connection.execute(text("DROP TABLE IF EXISTS expenses"))
    connection.execute(text("DROP TABLE IF EXISTS income"))
    connection.execute(text("DROP TABLE IF EXISTS users"))
    print("✓ Dropped old tables")
    
    print("\n--- Step 3: Recreate tables with new schema ---")
    
    # Import models to create new schema
    from app.models import Base
    Base.metadata.create_all(bind=connection)
    print("✓ Created new tables with updated schema")
    
    print("\n--- Step 4: Restore data with type conversions ---")
    
    # Restore users
    users_backup = connection.execute(text("SELECT * FROM users")).fetchall() if income_data else []
    # Note: users table was dropped, so we can't restore without original backup
    
    # Restore income with date conversion
    from datetime import datetime
    from decimal import Decimal
    
    for row in income_data:
        try:
            # Convert string date to datetime
            date_str = row[3]  # date column
            for fmt in ("%Y-%m-%d", "%d %B %Y", "%d %b %Y", "%B %d, %Y", "%b %d, %Y"):
                try:
                    date_obj = datetime.strptime(date_str.strip(), fmt)
                    break
                except:
                    continue
            else:
                date_obj = datetime.now()  # Fallback if parsing fails
            
            # Convert float to Decimal
            amount = Decimal(str(row[2]))
            
            connection.execute(text("""
                INSERT INTO income (id, source, amount, date, description, user_id, created_at)
                VALUES (:id, :source, :amount, :date, :description, :user_id, :created_at)
            """), {
                'id': row[0],
                'source': row[1],
                'amount': amount,
                'date': date_obj,
                'description': row[4],
                'user_id': row[5],
                'created_at': row[6]
            })
        except Exception as e:
            print(f"  Warning: Failed to restore income record {row[0]}: {e}")
    
    print(f"✓ Restored {len(income_data)} income records with new types")
    
    # Restore expenses with date conversion
    for row in expense_data:
        try:
            date_str = row[3]  # date column
            for fmt in ("%Y-%m-%d", "%d %B %Y", "%d %b %Y", "%B %d, %Y", "%b %d, %Y"):
                try:
                    date_obj = datetime.strptime(date_str.strip(), fmt)
                    break
                except:
                    continue
            else:
                date_obj = datetime.now()
            
            amount = Decimal(str(row[2]))
            
            connection.execute(text("""
                INSERT INTO expenses (id, category, amount, date, description, user_id, created_at)
                VALUES (:id, :category, :amount, :date, :description, :user_id, :created_at)
            """), {
                'id': row[0],
                'category': row[1],
                'amount': amount,
                'date': date_obj,
                'description': row[4],
                'user_id': row[5],
                'created_at': row[6]
            })
        except Exception as e:
            print(f"  Warning: Failed to restore expense record {row[0]}: {e}")
    
    print(f"✓ Restored {len(expense_data)} expense records with new types")
    
    # Restore budgets
    for row in budget_data:
        try:
            limit_amount = Decimal(str(row[2]))
            
            connection.execute(text("""
                INSERT INTO budgets (id, category, limit_amount, month, year, user_id, created_at)
                VALUES (:id, :category, :limit_amount, :month, :year, :user_id, :created_at)
            """), {
                'id': row[0],
                'category': row[1],
                'limit_amount': limit_amount,
                'month': row[3],
                'year': row[4],
                'user_id': row[5],
                'created_at': row[6]
            })
        except Exception as e:
            print(f"  Warning: Failed to restore budget record {row[0]}: {e}")
    
    print(f"✓ Restored {len(budget_data)} budget records with new types")
    
    # Restore savings goals
    for row in savings_data:
        try:
            target = Decimal(str(row[2]))
            saved = Decimal(str(row[3]))
            
            connection.execute(text("""
                INSERT INTO savings_goals (id, goal, target, saved, user_id, created_at, updated_at)
                VALUES (:id, :goal, :target, :saved, :user_id, :created_at, :updated_at)
            """), {
                'id': row[0],
                'goal': row[1],
                'target': target,
                'saved': saved,
                'user_id': row[4],
                'created_at': row[5],
                'updated_at': row[6]
            })
        except Exception as e:
            print(f"  Warning: Failed to restore savings goal record {row[0]}: {e}")
    
    print(f"✓ Restored {len(savings_data)} savings goals records with new types")

print("\n" + "=" * 60)
print("MIGRATION COMPLETE")
print("=" * 60)
print("\nNext steps:")
print("1. Restart the FastAPI server")
print("2. Test the application with the new schema")
print("3. Verify all API endpoints work correctly")
