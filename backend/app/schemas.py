from datetime import datetime
from decimal import Decimal
from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int


# =========================
# User Schemas
# =========================

class UserCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=12, max_length=128)
    type: str = Field(default="student", alias="type")

    model_config = ConfigDict(populate_by_name=True)

    @field_validator("type")
    @classmethod
    def validate_type(cls, value: str) -> str:
        allowed = {"student", "employee", "freelancer"}
        normalized = value.lower()
        if normalized not in allowed:
            raise ValueError("type must be student, employee, or freelancer")
        return normalized

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, value: str) -> str:
        if not any(c.isupper() for c in value):
            raise ValueError("Password must contain uppercase letter")
        if not any(c.islower() for c in value):
            raise ValueError("Password must contain lowercase letter")
        if not any(c.isdigit() for c in value):
            raise ValueError("Password must contain digit")
        if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in value):
            raise ValueError("Password must contain special character")
        return value


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    type: str
    dark_mode: bool = False
    email_notifications: bool = True
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    email: Optional[EmailStr] = None
    type: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RegisterResponse(BaseModel):
    message: str
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# =========================
# Income Schemas
# =========================

class IncomeCreate(BaseModel):
    source: str = Field(min_length=1, max_length=120)
    amount: Decimal = Field(gt=0)
    date: datetime
    description: str = ""


class IncomeUpdate(BaseModel):
    source: Optional[str] = Field(default=None, min_length=1, max_length=120)
    amount: Optional[Decimal] = Field(default=None, gt=0)
    date: Optional[datetime] = None
    description: Optional[str] = None


class IncomeResponse(BaseModel):
    id: int
    source: str
    amount: Decimal
    date: datetime
    description: str
    user_id: int

    model_config = ConfigDict(from_attributes=True)
    # =========================
# Expense Schemas
# =========================

class ExpenseCreate(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    amount: Decimal = Field(gt=0)
    date: datetime
    description: str = ""


class ExpenseUpdate(BaseModel):
    category: Optional[str] = Field(default=None, min_length=1, max_length=80)
    amount: Optional[Decimal] = Field(default=None, gt=0)
    date: Optional[datetime] = None
    description: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: int
    category: str
    amount: Decimal
    date: datetime
    description: str
    user_id: int

    model_config = ConfigDict(from_attributes=True)


# =========================
# Budget Schemas
# =========================

class BudgetCreate(BaseModel):
    category: str = Field(min_length=1, max_length=80)
    limit: Decimal = Field(gt=0, alias="limit")
    month: Optional[int] = Field(default=None, ge=1, le=12)
    year: Optional[int] = Field(default=None, ge=2000, le=2100)

    model_config = ConfigDict(populate_by_name=True)


class BudgetUpdate(BaseModel):
    category: Optional[str] = Field(default=None, min_length=1, max_length=80)
    limit: Optional[Decimal] = Field(default=None, gt=0, alias="limit")
    month: Optional[int] = Field(default=None, ge=1, le=12)
    year: Optional[int] = Field(default=None, ge=2000, le=2100)

    model_config = ConfigDict(populate_by_name=True)


class BudgetResponse(BaseModel):
    id: int
    category: str
    limit: Decimal
    spent: Decimal
    remaining: Decimal
    month: int
    year: int
    alert: bool = False
    user_id: int


# =========================
# Savings Goal Schemas
# =========================

class SavingsGoalCreate(BaseModel):
    goal: str = Field(min_length=1, max_length=200)
    target: Decimal = Field(gt=0)
    saved: Decimal = Field(default=0, ge=0)


class SavingsGoalUpdate(BaseModel):
    goal: Optional[str] = Field(default=None, min_length=1, max_length=200)
    target: Optional[Decimal] = Field(default=None, gt=0)
    saved: Optional[Decimal] = Field(default=None, ge=0)


class SavingsGoalResponse(BaseModel):
    id: int
    goal: str
    target: Decimal
    saved: Decimal
    progress: float
    completed: bool
    user_id: int


# =========================
# Transaction Schemas
# =========================

class TransactionResponse(BaseModel):
    id: int
    date: datetime
    type: str
    category: str
    amount: Decimal
    description: str


# =========================
# Dashboard / Analytics
# =========================

class DashboardSummary(BaseModel):
    total_income: Decimal
    total_expense: Decimal
    total_savings: Decimal
    savings_percentage: float
    budget_usage: float
    recent_transactions: List[TransactionResponse]


class MonthlyAnalyticsItem(BaseModel):
    month: str
    income: Decimal
    expense: Decimal


class CategoryBreakdownItem(BaseModel):
    name: str
    value: Decimal


class AnalyticsResponse(BaseModel):
    monthly: List[MonthlyAnalyticsItem]
    category_breakdown: List[CategoryBreakdownItem]
    trends: List[MonthlyAnalyticsItem]


# =========================
# Notifications
# =========================

class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    notification_type: str
    is_read: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)