from datetime import datetime

from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from .database import engine
from .models import Base


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    _migrate_legacy_schema()


def _migrate_legacy_schema() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("users"):
        return

    columns = {column["name"] for column in inspector.get_columns("users")}

    with engine.begin() as connection:
        if "type" in columns and "user_type" not in columns:
            connection.execute(text("ALTER TABLE users RENAME COLUMN type TO user_type"))

        if "dark_mode" not in columns:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN dark_mode BOOLEAN DEFAULT 0 NOT NULL")
            )

        if "email_notifications" not in columns:
            connection.execute(
                text(
                    "ALTER TABLE users ADD COLUMN email_notifications BOOLEAN DEFAULT 1 NOT NULL"
                )
            )

        if "created_at" not in columns:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN created_at DATETIME")
            )

        if "updated_at" not in columns:
            connection.execute(
                text("ALTER TABLE users ADD COLUMN updated_at DATETIME")
            )


def current_month_year() -> tuple[int, int]:
    now = datetime.now()
    return now.month, now.year


def paginate_query(query, page: int, page_size: int):
    page = max(page, 1)
    page_size = min(max(page_size, 1), 100)
    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    total_pages = max((total + page_size - 1) // page_size, 1)
    return items, total, page, page_size, total_pages
