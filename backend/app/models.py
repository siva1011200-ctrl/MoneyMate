from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    DateTime,
    Numeric,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from .database import Base


def utcnow():
    return datetime.now(timezone.utc)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    user_type = Column("user_type", String(50), nullable=False, default="student")
    dark_mode = Column(Boolean, default=False, nullable=False)
    email_notifications = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    incomes = relationship("Income", back_populates="owner", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="owner", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="owner", cascade="all, delete-orphan")
    savings_goals = relationship(
        "SavingsGoal", back_populates="owner", cascade="all, delete-orphan"
    )
    notifications = relationship(
        "Notification", back_populates="owner", cascade="all, delete-orphan"
    )


class Income(Base):
    __tablename__ = "income"
    __table_args__ = (
        Index("ix_income_user_date", "user_id", "date"),
        CheckConstraint("amount > 0", name="ck_income_amount_positive"),
    )

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(120), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, default="")
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    owner = relationship("User", back_populates="incomes")


class Expense(Base):
    __tablename__ = "expenses"
    __table_args__ = (
        Index("ix_expenses_user_date", "user_id", "date"),
        Index("ix_expenses_category", "category"),
        CheckConstraint("amount > 0", name="ck_expenses_amount_positive"),
    )

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(80), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    description = Column(Text, default="")
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    owner = relationship("User", back_populates="expenses")


class Budget(Base):
    __tablename__ = "budgets"
    __table_args__ = (
        UniqueConstraint("user_id", "category", "month", "year", name="uq_budget_period"),
        Index("ix_budgets_user_period", "user_id", "month", "year"),
        Index("ix_budgets_category", "category"),
        CheckConstraint("limit_amount > 0", name="ck_budget_limit_positive"),
        CheckConstraint("month >= 1 AND month <= 12", name="ck_budget_month_valid"),
        CheckConstraint("year >= 2000 AND year <= 2100", name="ck_budget_year_valid"),
    )

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(80), nullable=False)
    limit_amount = Column(Numeric(10, 2), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    owner = relationship("User", back_populates="budgets")


class SavingsGoal(Base):
    __tablename__ = "savings_goals"
    __table_args__ = (
        CheckConstraint("target > 0", name="ck_savings_target_positive"),
        CheckConstraint("saved >= 0", name="ck_savings_saved_non_negative"),
        CheckConstraint("saved <= target", name="ck_savings_saved_within_target"),
    )

    id = Column(Integer, primary_key=True, index=True)
    goal = Column(String(200), nullable=False)
    target = Column(Numeric(10, 2), nullable=False)
    saved = Column(Numeric(10, 2), default=0, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = Column(
        DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False
    )

    owner = relationship("User", back_populates="savings_goals")


class Notification(Base):
    __tablename__ = "notifications"
    __table_args__ = (Index("ix_notifications_user_read", "user_id", "is_read"),)

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), nullable=False, default="info")
    is_read = Column(Boolean, default=False, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utcnow, nullable=False)

    owner = relationship("User", back_populates="notifications")
