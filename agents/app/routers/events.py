from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
import asyncio, json, time
from redis import Redis

router = APIRouter(prefix="/events", tags=["Events"])

redis = Redis(host="redis", port=6379, db=0, decode_responses=True)
SSE_CHANNEL = "approval_events"

async def event_generator():
    pubsub = redis.pubsub()
    pubsub.subscribe(SSE_CHANNEL)
    try:
        while True:
            message = pubsub.get_message(ignore_subscribe_messages=True, timeout=1)
            if message and message.get("data"):
                try:
                    data = json.loads(message["data"])
                    yield {
                        "event": data.get("type", "message"),
                        "data": json.dumps(data["data"]),
                    }
                except json.JSONDecodeError:
                    pass
            # heartbeat every 10s to keep connection alive
            yield {
                "event": "heartbeat",
                "data": json.dumps({"time": time.time()}),
            }
            await asyncio.sleep(10)
    except asyncio.CancelledError:
        pubsub.close()
        raise

@router.get("/")
async def stream():
    return EventSourceResponse(event_generator())

