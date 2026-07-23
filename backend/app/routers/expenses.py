from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Expense, User
from ..schemas import ExpenseCreate, ExpenseResponse, ExpenseUpdate, PaginatedResponse
from ..utils import paginate_query

router = APIRouter(prefix="/expenses", tags=["Expenses"])


@router.get("/categories")
def list_categories(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    rows = (
        db.query(func.distinct(Expense.category))
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.category.asc())
        .all()
    )
    return [row[0] for row in rows]


@router.get("/", response_model=PaginatedResponse[ExpenseResponse])
def list_expenses(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Expense).filter(Expense.user_id == current_user.id)

    if search:
        query = query.filter(
            or_(
                Expense.category.ilike(f"%{search}%"),
                Expense.description.ilike(f"%{search}%"),
            )
        )

    if category:
        query = query.filter(Expense.category.ilike(category))

    if date_from:
        query = query.filter(Expense.date >= date_from)

    if date_to:
        query = query.filter(Expense.date <= date_to)

    query = query.order_by(Expense.date.desc(), Expense.id.desc())
    items, total, page, page_size, total_pages = paginate_query(query, page, page_size)

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("/", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    payload: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = Expense(
        category=payload.category.strip(),
        amount=payload.amount,
        date=payload.date,
        description=payload.description.strip(),
        user_id=current_user.id,
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    payload: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")

    if payload.category is not None:
        expense.category = payload.category.strip()
    if payload.amount is not None:
        expense.amount = payload.amount
    if payload.date is not None:
        expense.date = payload.date
    if payload.description is not None:
        expense.description = payload.description.strip()

    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Expense record not found")

    db.delete(expense)
    db.commit()
