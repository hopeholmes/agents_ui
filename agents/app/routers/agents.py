from fastapi import APIRouter
from core import redis_client

router = APIRouter(prefix="/agents")

@router.get("/queue")
def get_queue_status():
    length = redis_client.redis_client.llen("agent_tasks")
    return {"queue_length": length}

@router.post("/task")
def add_task(task: str):
    redis_client.redis_client.rpush("agent_tasks", task)
    return {"message": f"Task '{task}' added to queue."}
