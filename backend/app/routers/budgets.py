from datetime import datetime
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Budget, Expense, User
from ..schemas import BudgetCreate, BudgetResponse, BudgetUpdate
from ..services.notifications import check_budget_alerts
from ..utils import current_month_year

router = APIRouter(prefix="/budgets", tags=["Budgets"])

# Legacy route for backward compatibility with frontend
router_legacy = APIRouter(prefix="/budget", tags=["Budgets (Legacy)"])


def _calculate_spent(db: Session, user_id: int, category: str, month: int, year: int) -> Decimal:
    expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id,
            Expense.category == category,
            Expense.date >= datetime(year, month, 1),
            Expense.date < datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
        )
        .all()
    )
    total = Decimal('0')
    for expense in expenses:
        total += expense.amount
    return total


def _serialize_budget(db: Session, budget: Budget) -> BudgetResponse:
    spent = _calculate_spent(db, budget.user_id, budget.category, budget.month, budget.year)
    remaining = max(budget.limit_amount - spent, Decimal('0'))
    alert = spent >= budget.limit_amount * Decimal('0.8')

    return BudgetResponse(
        id=budget.id,
        category=budget.category,
        limit=budget.limit_amount,
        spent=spent,
        remaining=remaining,
        month=budget.month,
        year=budget.year,
        alert=alert,
        user_id=budget.user_id,
    )


@router.get("/", response_model=list[BudgetResponse])
def list_budgets(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_month, current_year = current_month_year()
    month = month or current_month
    year = year or current_year

    budgets = (
        db.query(Budget)
        .filter(
            Budget.user_id == current_user.id,
            Budget.month == month,
            Budget.year == year,
        )
        .order_by(Budget.category.asc())
        .all()
    )

    responses = [_serialize_budget(db, budget).model_dump() for budget in budgets]
    check_budget_alerts(db, current_user, responses)
    db.commit()

    return [_serialize_budget(db, budget) for budget in budgets]


@router.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget(
    payload: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_month, current_year = current_month_year()

    budget = Budget(
        category=payload.category.strip(),
        limit_amount=payload.limit,
        month=payload.month or current_month,
        year=payload.year or current_year,
        user_id=current_user.id,
    )
    db.add(budget)

    try:
        db.commit()
        db.refresh(budget)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Budget already exists for this category and month",
        ) from exc

    response = _serialize_budget(db, budget)
    check_budget_alerts(db, current_user, [response.model_dump()])
    db.commit()
    return response


@router.put("/{budget_id}", response_model=BudgetResponse)
def update_budget(
    budget_id: int,
    payload: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    if payload.category is not None:
        budget.category = payload.category.strip()
    if payload.limit is not None:
        budget.limit_amount = payload.limit
    if payload.month is not None:
        budget.month = payload.month
    if payload.year is not None:
        budget.year = payload.year

    try:
        db.commit()
        db.refresh(budget)
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Budget already exists for this category and month",
        ) from exc

    response = _serialize_budget(db, budget)
    check_budget_alerts(db, current_user, [response.model_dump()])
    db.commit()
    return response


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")

    db.delete(budget)
    db.commit()


# Legacy routes for backward compatibility
@router_legacy.get("/", response_model=list[BudgetResponse])
def list_budgets_legacy(
    month: Optional[int] = Query(None, ge=1, le=12),
    year: Optional[int] = Query(None, ge=2000, le=2100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_budgets(month, year, db, current_user)


@router_legacy.post("/", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
def create_budget_legacy(
    payload: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_budget(payload, db, current_user)


@router_legacy.get("/{budget_id}", response_model=BudgetResponse)
def get_budget_legacy(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Reuse the update logic to get the budget
    budget = (
        db.query(Budget)
        .filter(Budget.id == budget_id, Budget.user_id == current_user.id)
        .first()
    )
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
    return _serialize_budget(db, budget)


@router_legacy.put("/{budget_id}", response_model=BudgetResponse)
def update_budget_legacy(
    budget_id: int,
    payload: BudgetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_budget(budget_id, payload, db, current_user)


@router_legacy.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget_legacy(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_budget(budget_id, db, current_user)
