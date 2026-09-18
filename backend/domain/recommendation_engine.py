from datetime import datetime, timezone
import math
from typing import Optional, List, Dict, Any
from db.models import Task, Project

SCORING_WEIGHTS = {
    "urgency": 25,
    "priority": 20,
    "project_importance": 15,
    "blocking_impact": 15,
    "time_fit": 10,
    "recency_context": 10,
    "preference_fit": 5,
}

def score_urgency(task: Task, now: datetime) -> tuple[float, str]:
    if not task.due_date:
        return SCORING_WEIGHTS["urgency"] * 0.3, "No due date set"
    try:
        due_dt = datetime.fromisoformat(task.due_date).replace(tzinfo=timezone.utc)
        days_until = (due_dt - now).total_seconds() / 86400
        if days_until < 0:
            return float(SCORING_WEIGHTS["urgency"]), "Overdue"
        if days_until < 1:
            return SCORING_WEIGHTS["urgency"] * 0.9, "Due today"
        if days_until < 2:
            return SCORING_WEIGHTS["urgency"] * 0.75, "Due tomorrow"
        if days_until < 4:
            return SCORING_WEIGHTS["urgency"] * 0.5, f"Due in {math.ceil(days_until)} days"
        if days_until < 7:
            return SCORING_WEIGHTS["urgency"] * 0.3, f"Due in {math.ceil(days_until)} days"
        return SCORING_WEIGHTS["urgency"] * 0.1, f"Due in {math.ceil(days_until)} days"
    except Exception:
        return SCORING_WEIGHTS["urgency"] * 0.3, "Due date set"

def score_priority(task: Task) -> tuple[float, str]:
    p = (task.priority or "").lower()
    if p == "high":
        return float(SCORING_WEIGHTS["priority"]), "High priority"
    if p == "medium":
        return SCORING_WEIGHTS["priority"] * 0.6, "Medium priority"
    if p == "low":
        return SCORING_WEIGHTS["priority"] * 0.2, "Low priority"
    return SCORING_WEIGHTS["priority"] * 0.4, "Priority not set"

def score_project_importance(task: Task, projects: List[Project]) -> tuple[float, str]:
    if not task.project_id:
        return SCORING_WEIGHTS["project_importance"] * 0.3, "Standalone task"
    project = next((p for p in projects if p.id == task.project_id), None)
    if not project:
        return SCORING_WEIGHTS["project_importance"] * 0.2, "Project task"
    if project.status == "active":
        return float(SCORING_WEIGHTS["project_importance"]), f"Active project ({project.name})"
    if project.status == "paused":
        return SCORING_WEIGHTS["project_importance"] * 0.3, f"Paused project ({project.name})"
    return 0.0, "Project inactive"

def score_time_fit(task: Task, preferred_minutes: int = 25) -> tuple[float, str]:
    est = task.estimate_minutes or 30
    diff = abs(est - preferred_minutes)
    if diff <= 5:
        return float(SCORING_WEIGHTS["time_fit"]), f"Estimated {est} min"
    if diff <= 15:
        return SCORING_WEIGHTS["time_fit"] * 0.7, f"Estimated {est} min"
    if diff <= 30:
        return SCORING_WEIGHTS["time_fit"] * 0.4, f"Estimated {est} min"
    return SCORING_WEIGHTS["time_fit"] * 0.1, f"Estimated {est} min"

def score_recency_context(task: Task, now: datetime) -> float:
    if not task.created_at:
        return SCORING_WEIGHTS["recency_context"] * 0.5
    age_days = (now - task.created_at.replace(tzinfo=timezone.utc if task.created_at.tzinfo is None else task.created_at.tzinfo)).total_seconds() / 86400
    if age_days < 1:
        return float(SCORING_WEIGHTS["recency_context"])
    if age_days < 3:
        return SCORING_WEIGHTS["recency_context"] * 0.6
    if age_days < 7:
        return SCORING_WEIGHTS["recency_context"] * 0.3
    return SCORING_WEIGHTS["recency_context"] * 0.1

def compute_next_action(
    tasks: List[Task],
    projects: List[Project],
    now: Optional[datetime] = None,
    preferred_minutes: int = 25,
) -> Optional[Dict[str, Any]]:
    if now is None:
        now = datetime.now(timezone.utc)

    eligible = [t for t in tasks if t.status not in ("completed", "cancelled")]
    if not eligible:
        return None

    scored_items = []
    for task in eligible:
        signals = []

        u_val, u_reason = score_urgency(task, now)
        if round(u_val) > 0:
            signals.append({"type": "urgency", "value": round(u_val), "reason": u_reason})

        p_val, p_reason = score_priority(task)
        if round(p_val) > 0:
            signals.append({"type": "priority", "value": round(p_val), "reason": p_reason})

        proj_val, proj_reason = score_project_importance(task, projects)
        if round(proj_val) > 0:
            signals.append({"type": "project_importance", "value": round(proj_val), "reason": proj_reason})

        t_val, t_reason = score_time_fit(task, preferred_minutes)
        if round(t_val) > 0:
            signals.append({"type": "time_fit", "value": round(t_val), "reason": t_reason})

        rec_val = score_recency_context(task, now)
        if round(rec_val) > 0:
            signals.append({"type": "recency_context", "value": round(rec_val), "reason": "Recently created or updated"})

        raw_total = sum(s["value"] for s in signals)
        total_score = min(100, max(0, raw_total))
        scored_items.append({"task": task, "signals": signals, "total_score": total_score})

    scored_items.sort(key=lambda x: x["total_score"], reverse=True)
    best = scored_items[0]

    project_name = None
    if best["task"].project_id:
        proj = next((p for p in projects if p.id == best["task"].project_id), None)
        if proj:
            project_name = proj.name

    return {
        "task_id": str(best["task"].id),
        "title": best["task"].title,
        "project_id": str(best["task"].project_id) if best["task"].project_id else None,
        "project_name": project_name,
        "score": best["total_score"],
        "signals": best["signals"],
        "estimated_minutes": best["task"].estimate_minutes or 30,
        "priority": best["task"].priority,
        "due_date": best["task"].due_date,
    }
