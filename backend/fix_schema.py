from sqlalchemy import inspect, text
from app.database import engine

inspector = inspect(engine)
if inspector.has_table("users"):
    columns = {column["name"] for column in inspector.get_columns("users")}
    print("Current columns:", sorted(columns))
    
    missing = []
    if "created_at" not in columns:
        missing.append("created_at")
    if "updated_at" not in columns:
        missing.append("updated_at")
    
    if missing:
        print(f"\n❌ Missing columns: {missing}")
        print("\nAttempting to add them...")
        
        with engine.begin() as connection:
            for col in missing:
                if col == "created_at":
                    connection.execute(
                        text("ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP")
                    )
                    print("✅ Added created_at")
                elif col == "updated_at":
                    connection.execute(
                        text("ALTER TABLE users ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP")
                    )
                    print("✅ Added updated_at")
    else:
        print("\n✅ All expected columns present")
