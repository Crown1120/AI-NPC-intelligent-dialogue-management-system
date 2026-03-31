from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from datetime import datetime
import json
import os

class NPCConfig(BaseModel):
    npc_id: str
    name: str
    personality: str
    background: str
    speaking_style: str
    knowledge: List[str]
    emotional_range: List[str]
    default_emotion: str
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class NPCStorage:
    def __init__(self, storage_file: str = "npc_data.json"):
        self.storage_file = storage_file
        self.npcs: Dict[str, NPCConfig] = {}
        self._load()

    def _load(self):
        if os.path.exists(self.storage_file):
            try:
                with open(self.storage_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    for npc_id, npc_data in data.items():
                        self.npcs[npc_id] = NPCConfig(**npc_data)
            except Exception as e:
                print(f"Error loading NPC data: {e}")
                self._init_default_npcs()
        else:
            self._init_default_npcs()

    def _save(self):
        try:
            with open(self.storage_file, 'w', encoding='utf-8') as f:
                json.dump(
                    {npc_id: npc.model_dump() for npc_id, npc in self.npcs.items()},
                    f,
                    ensure_ascii=False,
                    indent=2
                )
        except Exception as e:
            print(f"Error saving NPC data: {e}")

    def _init_default_npcs(self):
        default_npcs = [
            NPCConfig(
                npc_id="npc_001",
                name="守卫",
                personality="严格但公正，忠诚，有责任感",
                background="城市守卫，负责维护城市治安，曾在军队服役多年",
                speaking_style="正式、简洁，偶尔会使用军事术语",
                knowledge=["城市法规", "巡逻路线", "基本战斗技能", "城市历史"],
                emotional_range=["严肃", "警惕", "友好", "怀疑"],
                default_emotion="严肃",
                is_active=True,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat()
            ),
            NPCConfig(
                npc_id="npc_002",
                name="商贩",
                personality="精明、热情、善于交际",
                background="城市市场的老商贩，经营各种商品，消息灵通",
                speaking_style="热情、夸张，喜欢用比喻和谚语",
                knowledge=["商品价格", "市场行情", "城市八卦", "讨价还价技巧"],
                emotional_range=["热情", "精明", "友好", "贪婪"],
                default_emotion="热情",
                is_active=True,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat()
            ),
            NPCConfig(
                npc_id="npc_003",
                name="酒馆老板娘",
                personality="健谈、八卦、心地善良",
                background="经营城市最大的酒馆，了解各种消息和传闻",
                speaking_style="亲切、唠叨，喜欢分享故事",
                knowledge=["酒类知识", "城市传闻", "客人喜好", "烹饪技巧"],
                emotional_range=["亲切", "八卦", "关心", "好奇"],
                default_emotion="亲切",
                is_active=True,
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat()
            ),
        ]
        for npc in default_npcs:
            self.npcs[npc.npc_id] = npc
        self._save()

    def get_all(self) -> List[NPCConfig]:
        return list(self.npcs.values())

    def get_by_id(self, npc_id: str) -> Optional[NPCConfig]:
        return self.npcs.get(npc_id)

    def create(self, npc: NPCConfig) -> NPCConfig:
        npc.created_at = datetime.now().isoformat()
        npc.updated_at = datetime.now().isoformat()
        self.npcs[npc.npc_id] = npc
        self._save()
        return npc

    def update(self, npc_id: str, npc: NPCConfig) -> Optional[NPCConfig]:
        if npc_id not in self.npcs:
            return None
        npc.updated_at = datetime.now().isoformat()
        if npc.created_at is None:
            npc.created_at = self.npcs[npc_id].created_at
        self.npcs[npc_id] = npc
        self._save()
        return npc

    def delete(self, npc_id: str) -> bool:
        if npc_id in self.npcs:
            del self.npcs[npc_id]
            self._save()
            return True
        return False

npc_storage = NPCStorage()
