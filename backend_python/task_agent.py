from typing import Dict, Any
import asyncio

class TaskAgent:
    def __init__(self):
        pass

    async def generate_task(self, npc_id: str, player_id: str) -> Dict[str, Any]:
        # Mocking task generation logic
        task_id = "quest_123"
        title = "The Guard's Request"
        description = "Go and find the missing key near the bar."
        reward = {
            "exp": 100,
            "money": 50
        }

        return {
            "taskId": task_id,
            "title": title,
            "description": description,
            "reward": reward
        }
