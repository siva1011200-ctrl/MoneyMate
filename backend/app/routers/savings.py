from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import SavingsGoal, User
from ..schemas import SavingsGoalCreate, SavingsGoalResponse, SavingsGoalUpdate
from ..services.notifications import check_goal_completion

router = APIRouter(prefix="/savings-goals", tags=["Savings Goals"])

# Legacy route for backward compatibility with frontend
router_legacy = APIRouter(prefix="/savings", tags=["Savings Goals (Legacy)"])


def _serialize_goal(goal: SavingsGoal) -> SavingsGoalResponse:
    progress = min(float((goal.saved / goal.target) * 100), 100) if goal.target else 0
    return SavingsGoalResponse(
        id=goal.id,
        goal=goal.goal,
        target=goal.target,
        saved=goal.saved,
        progress=round(progress, 2),
        completed=goal.saved >= goal.target,
        user_id=goal.user_id,
    )


@router.get("/", response_model=list[SavingsGoalResponse])
def list_savings_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goals = (
        db.query(SavingsGoal)
        .filter(SavingsGoal.user_id == current_user.id)
        .order_by(SavingsGoal.created_at.desc())
        .all()
    )
    return [_serialize_goal(goal) for goal in goals]


@router.post("/", response_model=SavingsGoalResponse, status_code=status.HTTP_201_CREATED)
def create_savings_goal(
    payload: SavingsGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if payload.saved > payload.target:
        raise HTTPException(status_code=400, detail="Saved amount cannot exceed target")

    goal = SavingsGoal(
        goal=payload.goal.strip(),
        target=payload.target,
        saved=payload.saved,
        user_id=current_user.id,
    )
    db.add(goal)
    db.commit()
    db.refresh(goal)

    check_goal_completion(db, current_user, goal)
    db.commit()

    return _serialize_goal(goal)


@router.put("/{goal_id}", response_model=SavingsGoalResponse)
def update_savings_goal(
    goal_id: int,
    payload: SavingsGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = (
        db.query(SavingsGoal)
        .filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")

    if payload.goal is not None:
        goal.goal = payload.goal.strip()
    if payload.target is not None:
        goal.target = payload.target
    if payload.saved is not None:
        goal.saved = payload.saved

    if goal.saved > goal.target:
        raise HTTPException(status_code=400, detail="Saved amount cannot exceed target")

    db.commit()
    db.refresh(goal)

    check_goal_completion(db, current_user, goal)
    db.commit()

    return _serialize_goal(goal)


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_savings_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    goal = (
        db.query(SavingsGoal)
        .filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")

    db.delete(goal)
    db.commit()


# Legacy routes for backward compatibility
@router_legacy.get("/", response_model=list[SavingsGoalResponse])
def list_savings_goals_legacy(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return list_savings_goals(db, current_user)


@router_legacy.post("/", response_model=SavingsGoalResponse, status_code=status.HTTP_201_CREATED)
def create_savings_goal_legacy(
    payload: SavingsGoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_savings_goal(payload, db, current_user)


@router_legacy.get("/{goal_id}", response_model=SavingsGoalResponse)
def get_savings_goal_legacy(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Reuse the update logic to get the goal
    goal = (
        db.query(SavingsGoal)
        .filter(SavingsGoal.id == goal_id, SavingsGoal.user_id == current_user.id)
        .first()
    )
    if not goal:
        raise HTTPException(status_code=404, detail="Savings goal not found")
    return _serialize_goal(goal)


@router_legacy.put("/{goal_id}", response_model=SavingsGoalResponse)
def update_savings_goal_legacy(
    goal_id: int,
    payload: SavingsGoalUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return update_savings_goal(goal_id, payload, db, current_user)


@router_legacy.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_savings_goal_legacy(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return delete_savings_goal(goal_id, db, current_user)
