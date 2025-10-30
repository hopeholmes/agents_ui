from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import asyncio, json, datetime
from redis import Redis

router = APIRouter(prefix="/events", tags=["Logs"])
redis = Redis(host="redis", port=6379, db=0, decode_responses=True)
LOGS_CHANNEL = "logs_channel"

def publish_log(message: str):
    payload = {"timestamp": datetime.datetime.utcnow().isoformat(), "message": message}
    redis.publish(LOGS_CHANNEL, json.dumps(payload))

@router.get("/logs")
async def logs_stream(request: Request):
    pubsub = redis.pubsub()
    pubsub.subscribe(LOGS_CHANNEL)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                msg = pubsub.get_message(ignore_subscribe_messages=True, timeout=1.0)
                if msg and msg["type"] == "message":
                    yield {"data": msg["data"]}
                await asyncio.sleep(0.25)
        finally:
            pubsub.close()

    return EventSourceResponse(event_generator())
