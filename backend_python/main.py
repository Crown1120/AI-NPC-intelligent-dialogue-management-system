from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from npc_agent import NPCAgent
from npc_storage import NPCConfig, npc_storage
from task_agent import TaskAgent
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

npc_agent = NPCAgent()
task_agent = TaskAgent()

class ChatRequest(BaseModel):
    npcId: str
    message: str
    playerId: str
    context: Optional[Dict[str, Any]] = None

class TaskRequest(BaseModel):
    npcId: str
    playerId: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = await npc_agent.generate_response(
            npc_id=request.npcId,
            message=request.message,
            player_id=request.playerId,
            context=request.context
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/task")
async def generate_task(request: TaskRequest):
    try:
        response = await task_agent.generate_task(
            npc_id=request.npcId,
            player_id=request.playerId
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/npcs")
async def get_npcs():
    return npc_storage.get_all()

@app.get("/npcs/{npc_id}")
async def get_npc(npc_id: str):
    npc = npc_storage.get_by_id(npc_id)
    if not npc:
        raise HTTPException(status_code=404, detail="NPC not found")
    return npc

@app.post("/npcs")
async def create_npc(npc: NPCConfig):
    if npc_storage.get_by_id(npc.npc_id):
        raise HTTPException(status_code=400, detail="NPC ID already exists")
    return npc_storage.create(npc)

@app.put("/npcs/{npc_id}")
async def update_npc(npc_id: str, npc: NPCConfig):
    updated = npc_storage.update(npc_id, npc)
    if not updated:
        raise HTTPException(status_code=404, detail="NPC not found")
    return updated

@app.delete("/npcs/{npc_id}")
async def delete_npc(npc_id: str):
    if not npc_storage.delete(npc_id):
        raise HTTPException(status_code=404, detail="NPC not found")
    return {"message": "NPC deleted successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
