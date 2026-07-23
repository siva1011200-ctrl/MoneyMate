from sqlalchemy.orm import Session

from ..models import Notification, SavingsGoal, User


def create_notification(
    db: Session,
    user: User,
    title: str,
    message: str,
    notification_type: str = "info",
) -> Notification:
    notification = Notification(
        title=title,
        message=message,
        notification_type=notification_type,
        user_id=user.id,
    )
    db.add(notification)
    return notification


def check_budget_alerts(db: Session, user: User, budget_responses: list) -> None:
    for budget in budget_responses:
        if budget.get("alert"):
            existing = (
                db.query(Notification)
                .filter(
                    Notification.user_id == user.id,
                    Notification.notification_type == "budget_warning",
                    Notification.message.contains(budget["category"]),
                    Notification.is_read.is_(False),
                )
                .first()
            )
            if existing:
                continue

            create_notification(
                db,
                user,
                title="Budget Warning",
                message=(
                    f"Budget alert for {budget['category']}: "
                    f"spent ₹{budget['spent']:.2f} of ₹{budget['limit']:.2f}."
                ),
                notification_type="budget_warning",
            )


def check_goal_completion(db: Session, user: User, goal: SavingsGoal) -> None:
    if goal.saved < goal.target:
        return

    existing = (
        db.query(Notification)
        .filter(
            Notification.user_id == user.id,
            Notification.notification_type == "goal_completion",
            Notification.message.contains(goal.goal),
        )
        .first()
    )
    if existing:
        return

    create_notification(
        db,
        user,
        title="Savings Goal Completed",
        message=f"Congratulations! You reached your goal: {goal.goal}.",
        notification_type="goal_completion",
    )
