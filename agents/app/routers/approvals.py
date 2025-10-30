# /srv/agents/app/routers/approvals.py
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import json, uuid, datetime, asyncio
from redis import Redis
from sse_starlette.sse import EventSourceResponse

# ---------------------------------------------------------------------
#  Router setup
# ---------------------------------------------------------------------
router = APIRouter(prefix="/approvals", tags=["Approvals"])

# Redis client – adjust host if needed
redis = Redis(host="redis", port=6379, db=0, decode_responses=True)

# SSE broadcast channel name
SSE_CHANNEL = "approval_events"

# ---------------------------------------------------------------------
#  Models
# ---------------------------------------------------------------------
class ApprovalItem(BaseModel):
    id: str
    title: str
    content: str
    agent: Optional[str] = "unknown"
    created_at: datetime.datetime
    status: str = "pending"
    comments: Optional[str] = None


# ---------------------------------------------------------------------
#  Helpers
# ---------------------------------------------------------------------
def _redis_key(item_id: str) -> str:
    return f"approval:{item_id}"


def _publish_event(event_type: str, payload: dict):
    """Send an event through Redis pub/sub channel for SSE relay."""
    message = json.dumps({"type": event_type, "data": payload})
    redis.publish(SSE_CHANNEL, message)


# ---------------------------------------------------------------------
#  Routes
# ---------------------------------------------------------------------

@router.get("/pending", response_model=List[ApprovalItem])
async def get_pending():
    """Return all pending approval items."""
    items = []
    for key in redis.scan_iter("approval:*"):
        data = redis.get(key)
        if not data:
            continue
        obj = json.loads(data)
        if obj.get("status") == "pending":
            items.append(obj)
    return items


@router.post("/new", response_model=ApprovalItem)
async def create_approval(item: ApprovalItem):
    """Create new approval item (normally called by an agent)."""
    if not item.id:
        item.id = str(uuid.uuid4())
    redis.set(_redis_key(item.id), item.json())
    _publish_event("approval_new", item.dict())
    return item


@router.post("/{item_id}/approve")
async def approve_item(item_id: str):
    """Mark an approval item as approved."""
    key = _redis_key(item_id)
    data = redis.get(key)
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    obj = json.loads(data)
    obj["status"] = "approved"
    obj["approved_at"] = datetime.datetime.utcnow().isoformat()
    redis.set(key, json.dumps(obj))
    _publish_event("approval_update", obj)
    return JSONResponse({"status": "approved", "id": item_id})


@router.post("/{item_id}/reject")
async def reject_item(item_id: str):
    """Mark an approval item as rejected."""
    key = _redis_key(item_id)
    data = redis.get(key)
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    obj = json.loads(data)
    obj["status"] = "rejected"
    obj["rejected_at"] = datetime.datetime.utcnow().isoformat()
    redis.set(key, json.dumps(obj))
    _publish_event("approval_update", obj)
    return JSONResponse({"status": "rejected", "id": item_id})


@router.post("/{item_id}/comment")
async def comment_item(item_id: str, comment: str):
    """Add a comment to an approval item."""
    key = _redis_key(item_id)
    data = redis.get(key)
    if not data:
        raise HTTPException(status_code=404, detail="Item not found")
    obj = json.loads(data)
    obj["comments"] = comment
    redis.set(key, json.dumps(obj))
    _publish_event("approval_comment", {"id": item_id, "comment": comment})
    return JSONResponse({"status": "comment_added", "id": item_id})


# ---------------------------------------------------------------------
#  SSE Stream
# ---------------------------------------------------------------------

@router.get("/events")
async def approvals_event_stream(request: Request):
    """Server-Sent Events stream for approval updates (consumed by frontend)."""
    pubsub = redis.pubsub()
    pubsub.subscribe(SSE_CHANNEL)

    async def event_generator():
        try:
            while True:
                # Exit cleanly if client disconnects
                if await request.is_disconnected():
                    break

                message = pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if message and message["type"] == "message":
                    data = json.loads(message["data"])
                    yield {
                        "event": data.get("type", "message"),
                        "data": json.dumps(data),
                    }

                await asyncio.sleep(0.25)
        finally:
            pubsub.close()

    return EventSourceResponse(event_generator())
