import sqlite3

conn = sqlite3.connect('moneymate.db')
cursor = conn.cursor()

# Method 1: Using PRAGMA
cursor.execute('PRAGMA table_info(users)')
cols_pragma = cursor.fetchall()

# Method 2: Query table directly
cursor.execute('SELECT * FROM users LIMIT 1')
cols_select = [desc[0] for desc in cursor.description]

print("Using PRAGMA table_info:")
for col in cols_pragma:
    print(f"  {col[1]}: {col[2]}")

print("\nUsing SELECT * query:")
for col in cols_select:
    print(f"  {col}")

conn.close()
