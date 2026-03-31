from typing import Dict, Any, Optional
import asyncio
import random
from npc_storage import npc_storage

class NPCAgent:
    def __init__(self):
        pass

    async def generate_response(self, npc_id: str, message: str, player_id: str, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        npc_config = npc_storage.get_by_id(npc_id)
        
        if not npc_config:
            return {
                "reply": "我不认识你。",
                "action": {"type": "none"},
                "emotion": "困惑"
            }
        
        npc_name = npc_config.name
        personality = npc_config.personality
        speaking_style = npc_config.speaking_style
        knowledge = ", ".join(npc_config.knowledge)
        emotion = random.choice(npc_config.emotional_range) if npc_config.emotional_range else npc_config.default_emotion
        
        response_templates = [
            f"[{npc_name}]（{emotion}地）: {message}? 作为{npc_config.background}，我必须告诉你，{personality}。",
            f"[{npc_name}] 用{speaking_style}的语气回应: \"{message}\"... 嗯，这让我想起了{knowledge}。",
            f"[{npc_name}]（{emotion}）: 你说\"{message}\"? 有意思。{personality}。",
            f"[{npc_name}]: {message}... 我了解一些关于{knowledge}的事情。",
            f"[{npc_name}]（{emotion}地）: {personality}。关于你说的\"{message}\"，我有些想法..."
        ]
        
        reply = random.choice(response_templates)
        
        actions = ["none", "nod", "wave", "point", "shake_head", "smile"]
        action = random.choice(actions)
        
        return {
            "reply": reply,
            "action": {"type": action},
            "emotion": emotion,
            "npc_info": {
                "name": npc_name,
                "personality": personality,
                "background": npc_config.background
            }
        }
