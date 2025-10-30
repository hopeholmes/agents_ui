from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/objectives")
async def get_objectives():
    return {
        "objectives": [
            {"id": 1, "title": "Sync tour dates with CRM", "status": "active"},
            {"id": 2, "title": "Draft press release for winter tour", "status": "pending"},
        ]
    }

@router.get("/approvals/pending")
async def get_approvals():
    return {
        "approvals": [
            {"id": "a-001", "type": "social_post", "summary": "IG caption for Tahoe show"},
            {"id": "a-002", "type": "press_email", "summary": "Local outlet outreach draft"},
        ]
    }

@router.get("/logs")
async def get_logs():
    return {
        "logs": [
            f"{datetime.utcnow().isoformat()}  – Strategy Agent updated objectives.",
            f"{datetime.utcnow().isoformat()}  – Social Agent queued post for review."
        ]
    }
