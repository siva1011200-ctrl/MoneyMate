from datetime import datetime
from decimal import Decimal

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Budget, Expense, Income, User
from ..schemas import DashboardSummary, TransactionResponse
from ..utils import current_month_year

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


def _monthly_transactions(
    db: Session, user_id: int, month: int, year: int
) -> list[TransactionResponse]:
    transactions: list[TransactionResponse] = []

    month_start = datetime(year, month, 1)
    month_end = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)

    incomes = db.query(Income).filter(
        Income.user_id == user_id,
        Income.date >= month_start,
        Income.date < month_end
    ).all()
    for item in incomes:
        transactions.append(
            TransactionResponse(
                id=item.id,
                date=item.date,
                type="Income",
                category=item.source,
                amount=item.amount,
                description=item.description or "Income added",
            )
        )

    expenses = db.query(Expense).filter(
        Expense.user_id == user_id,
        Expense.date >= month_start,
        Expense.date < month_end
    ).all()
    for item in expenses:
        transactions.append(
            TransactionResponse(
                id=item.id,
                date=item.date,
                type="Expense",
                category=item.category,
                amount=item.amount,
                description=item.description or "Expense added",
            )
        )

    transactions.sort(key=lambda row: row.date, reverse=True)
    return transactions


@router.get("/summary", response_model=DashboardSummary)
def dashboard_summary(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_month, current_year = current_month_year()
    month = month or current_month
    year = year or current_year

    transactions = _monthly_transactions(db, current_user.id, month, year)
    total_income = sum((item.amount for item in transactions if item.type == "Income"), Decimal('0'))
    total_expense = sum((item.amount for item in transactions if item.type == "Expense"), Decimal('0'))
    total_savings = total_income - total_expense
    savings_percentage = round(float((total_savings / total_income) * 100), 2) if total_income else 0

    budgets = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == month,
            Budget.year == year,
        )
        .all()
    )

    budget_usage = Decimal('0')
    if budgets:
        spent_total = Decimal('0')
        limit_total = Decimal('0')
        month_start = datetime(year, month, 1)
        month_end = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
        for budget in budgets:
            limit_total += budget.limit_amount
            spent_total += sum(
                (expense.amount
                for expense in db.query(Expense)
                .filter(
                    Expense.user_id == current_user.id,
                    Expense.category == budget.category,
                    Expense.date >= month_start,
                    Expense.date < month_end
                )
                .all())
            )
        budget_usage = round(float((spent_total / limit_total) * 100), 2) if limit_total else 0

    return DashboardSummary(
        total_income=float(round(total_income, 2)),
        total_expense=float(round(total_expense, 2)),
        total_savings=float(round(total_savings, 2)),
        savings_percentage=savings_percentage,
        budget_usage=budget_usage,
        recent_transactions=transactions[:10],
    )
