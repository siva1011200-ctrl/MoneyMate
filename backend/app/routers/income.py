from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Income, User
from ..schemas import IncomeCreate, IncomeResponse, IncomeUpdate, PaginatedResponse
from ..utils import paginate_query

router = APIRouter(prefix="/income", tags=["Income"])


@router.get("/", response_model=PaginatedResponse[IncomeResponse])
def list_income(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    source: Optional[str] = Query(None),
    date_from: Optional[datetime] = Query(None),
    date_to: Optional[datetime] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(Income).filter(Income.user_id == current_user.id)

    if search:
        query = query.filter(
            or_(
                Income.source.ilike(f"%{search}%"),
                Income.description.ilike(f"%{search}%"),
            )
        )

    if source:
        query = query.filter(Income.source.ilike(f"%{source}%"))

    if date_from:
        query = query.filter(Income.date >= date_from)

    if date_to:
        query = query.filter(Income.date <= date_to)

    query = query.order_by(Income.date.desc(), Income.id.desc())
    items, total, page, page_size, total_pages = paginate_query(query, page, page_size)

    return PaginatedResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post("/", response_model=IncomeResponse, status_code=status.HTTP_201_CREATED)
def create_income(
    payload: IncomeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    income = Income(
        source=payload.source.strip(),
        amount=payload.amount,
        date=payload.date,
        description=payload.description.strip(),
        user_id=current_user.id,
    )
    db.add(income)
    db.commit()
    db.refresh(income)
    return income


@router.get("/{income_id}", response_model=IncomeResponse)
def get_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    income = (
        db.query(Income)
        .filter(Income.id == income_id, Income.user_id == current_user.id)
        .first()
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")
    return income


@router.put("/{income_id}", response_model=IncomeResponse)
def update_income(
    income_id: int,
    payload: IncomeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    income = (
        db.query(Income)
        .filter(Income.id == income_id, Income.user_id == current_user.id)
        .first()
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")

    if payload.source is not None:
        income.source = payload.source.strip()
    if payload.amount is not None:
        income.amount = payload.amount
    if payload.date is not None:
        income.date = payload.date
    if payload.description is not None:
        income.description = payload.description.strip()

    db.commit()
    db.refresh(income)
    return income


@router.delete("/{income_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_income(
    income_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    income = (
        db.query(Income)
        .filter(Income.id == income_id, Income.user_id == current_user.id)
        .first()
    )
    if not income:
        raise HTTPException(status_code=404, detail="Income record not found")

    db.delete(income)
    db.commit()
