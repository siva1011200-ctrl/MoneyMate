#!/usr/bin/env python
import sqlite3
from pathlib import Path

db_path = Path(__file__).parent / "moneymate.db"

if not db_path.exists():
    print("❌ Database file does not exist")
    exit(1)

conn = sqlite3.connect(str(db_path))
cursor = conn.cursor()

# Check tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()

print("📊 Database Tables:")
for table in tables:
    print(f"  - {table[0]}")

print("\n📋 Users table schema:")
cursor.execute("PRAGMA table_info(users)")
columns = cursor.fetchall()
if not columns:
    print("  ❌ Users table does not exist!")
else:
    for col in columns:
        cid, name, type_, notnull, dflt_value, pk = col
        nullable = "✓ NULL" if not notnull else "NOT NULL"
        print(f"  - {name}: {type_} ({nullable})")

conn.close()
