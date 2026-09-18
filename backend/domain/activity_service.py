import uuid
from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from db.models import ActivityEvent as ActivityEventModel

async def record_activity(
    db: AsyncSession,
    user_id: uuid.UUID,
    event_type: str,
    entity_id: uuid.UUID,
    entity_type: str,
    metadata_payload: Optional[Dict[str, Any]] = None,
) -> ActivityEventModel:
    try:
        event = ActivityEventModel(
            user_id=user_id,
            type=event_type,
            entity_id=entity_id,
            entity_type=entity_type,
            metadata_payload=metadata_payload or {},
            occurred_at=datetime.now(timezone.utc),
        )
        db.add(event)
        await db.commit()
        return event
    except Exception as e:
        print(f"[ActivityService] Error recording activity event: {e}")
        return None
