# 🎮 AI NPC 智能对话管理系统

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Python](https://img.shields.io/badge/Python-3.10+-green.svg)
![React](https://img.shields.io/badge/React-18.2+-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

一个功能完整的 AI NPC（非玩家角色）智能对话管理系统，支持动态配置 NPC 属性、实时对话测试和数据统计分析。

[功能特性](#-功能特性) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [API文档](#-api文档) • [技术栈](#-技术栈)

</div>

---

## 📖 目录

- [项目简介](#项目简介)
- [功能特性](#-功能特性)
- [系统架构](#-系统架构)
- [快速开始](#-快速开始)
  - [环境要求](#环境要求)
  - [安装步骤](#安装步骤)
  - [启动服务](#启动服务)
- [项目结构](#-项目结构)
- [功能模块](#-功能模块)
- [API文档](#-api文档)
- [技术栈](#-技术栈)
- [配置说明](#配置说明)
- [开发指南](#开发指南)
- [路线图](#路线图)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

---

## 项目简介

AI NPC 智能对话管理系统是一个面向游戏开发者的 NPC 管理平台，允许开发者通过可视化界面配置 NPC 的性格、背景、知识领域等属性，并实时测试 NPC 的对话效果。系统采用前后端分离架构，后端使用 Python FastAPI，前端使用 React + Ant Design。

### 核心价值

- 🎯 **可视化配置**：无需编码即可创建和修改 NPC 属性
- 🧪 **实时测试**：即时验证 NPC 对话效果
- 📊 **数据分析**：统计 NPC 交互数据和性能指标
- 🔧 **灵活扩展**：支持接入多种 LLM 模型

---

## ✨ 功能特性

### 🤖 NPC 管理

| 功能 | 描述 |
|------|------|
| NPC 创建 | 创建新的 NPC 角色，设置名称、性格、背景等属性 |
| NPC 编辑 | 修改已有 NPC 的配置信息 |
| NPC 删除 | 删除不需要的 NPC 角色 |
| 状态管理 | 设置 NPC 在线/离线状态 |

### 💬 对话测试

| 功能 | 描述 |
|------|------|
| 实时对话 | 与选定的 NPC 进行实时对话测试 |
| 情绪显示 | 显示 NPC 当前的情绪状态 |
| 动作反馈 | 展示 NPC 的动作行为（点头、挥手等） |
| 对话历史 | 保留当前会话的对话记录 |

### 📊 数据统计

| 功能 | 描述 |
|------|------|
| 交互统计 | 统计 NPC 交互次数、响应时间等 |
| 趋势图表 | 展示交互趋势的可视化图表 |
| 日志记录 | 记录所有对话日志 |

### ⚙️ 系统设置

- API 网关配置
- 模型来源选择
- JWT 认证说明

---

## 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │NPC列表  │ │NPC测试  │ │对话日志 │ │数据统计 │           │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │
│       │           │           │           │                 │
│       └───────────┴───────────┴───────────┘                 │
│                       │                                      │
│                       ▼                                      │
│              ┌────────────────┐                              │
│              │   API Client   │                              │
│              └────────┬───────┘                              │
└───────────────────────┼─────────────────────────────────────┘
                        │ HTTP/WebSocket
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI + Python)                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    API Layer                         │    │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │    │
│  │  │/npcs    │ │/chat    │ │/task    │ │/logs    │   │    │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘   │    │
│  └───────┼───────────┼───────────┼───────────┼─────────┘    │
│          │           │           │           │               │
│          ▼           ▼           ▼           ▼               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                 Business Layer                       │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │    │
│  │  │  NPC Agent  │  │ Task Agent  │  │ NPC Storage │  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  LLM Integration                     │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐              │    │
│  │  │ OpenAI  │  │  Local  │  │  Mock   │              │    │
│  │  └─────────┘  └─────────┘  └─────────┘              │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 环境要求

| 依赖 | 版本要求 |
|------|----------|
| Python | >= 3.10 |
| Node.js | >= 18.0 |
| npm | >= 9.0 |
| Git | 最新版本 |

### 安装步骤

#### 1. 克隆项目

```bash
git clone https://github.com/SkyCrown111/ai-npc-management-system.git
cd ai-npc-management-system
```

#### 2. 后端安装

```bash
# 进入后端目录
cd backend_python

# 创建虚拟环境 (推荐)
python -m venv .venv

# 激活虚拟环境
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

# 安装依赖
pip install -r requirements.txt
```

#### 3. 前端安装

```bash
# 进入前端目录
cd ../frontend

# 安装依赖
npm install
```

### 启动服务

#### 方式一：分别启动（推荐开发使用）

**启动后端服务：**

```bash
cd backend_python
python main.py
```

后端服务将在 `http://localhost:8000` 启动

**启动前端服务：**

```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:3001` 启动

#### 方式二：一键启动（Windows）

```powershell
# 在项目根目录创建 start.ps1 文件
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend_python; python main.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

### 访问应用

打开浏览器访问：`http://localhost:3001`

---

## 📁 项目结构

```
ai-npc-management-system/
├── 📂 backend_python/           # Python 后端
│   ├── 📄 main.py              # FastAPI 主应用入口
│   ├── 📄 npc_agent.py         # NPC 对话代理
│   ├── 📄 npc_storage.py       # NPC 数据存储
│   ├── 📄 task_agent.py        # 任务生成代理
│   ├── 📄 requirements.txt     # Python 依赖
│   └── 📄 npc_data.json        # NPC 数据文件（自动生成）
│
├── 📂 frontend/                 # React 前端
│   ├── 📂 src/
│   │   ├── 📂 pages/           # 页面组件
│   │   │   ├── 📄 NpcListPage.tsx      # NPC 列表页
│   │   │   ├── 📄 NpcTestPage.tsx      # NPC 测试页
│   │   │   ├── 📄 LogsPage.tsx         # 日志页面
│   │   │   ├── 📄 StatsPage.tsx        # 统计页面
│   │   │   └── 📄 SettingsPage.tsx     # 设置页面
│   │   ├── 📄 App.tsx          # 主应用组件
│   │   ├── 📄 main.tsx         # 入口文件
│   │   └── 📂 pages/
│   │       └── 📄 index.ts     # 页面导出
│   ├── 📄 package.json         # Node 依赖
│   ├── 📄 tsconfig.json        # TypeScript 配置
│   └── 📄 vite.config.ts       # Vite 配置
│
├── 📄 README.md                 # 项目文档
├── 📄 .gitignore               # Git 忽略文件
└── 📄 LICENSE                  # 许可证
```

---

## 🔧 功能模块

### NPC 配置属性

每个 NPC 支持以下配置：

| 属性 | 类型 | 描述 |
|------|------|------|
| `npc_id` | string | NPC 唯一标识符 |
| `name` | string | NPC 名称 |
| `personality` | string | 性格特征 |
| `background` | string | 背景故事 |
| `speaking_style` | string | 说话风格 |
| `knowledge` | string[] | 知识领域列表 |
| `emotional_range` | string[] | 情绪范围 |
| `default_emotion` | string | 默认情绪 |
| `is_active` | boolean | 是否在线 |

### 示例 NPC 配置

```json
{
  "npc_id": "npc_001",
  "name": "守卫",
  "personality": "严格但公正，忠诚，有责任感",
  "background": "城市守卫，负责维护城市治安，曾在军队服役多年",
  "speaking_style": "正式、简洁，偶尔会使用军事术语",
  "knowledge": ["城市法规", "巡逻路线", "基本战斗技能", "城市历史"],
  "emotional_range": ["严肃", "警惕", "友好", "怀疑"],
  "default_emotion": "严肃",
  "is_active": true
}
```

---

## 📡 API文档

### 基础URL

```
http://localhost:8000
```

### NPC 管理 API

#### 获取所有 NPC

```http
GET /npcs
```

**响应示例：**

```json
[
  {
    "npc_id": "npc_001",
    "name": "守卫",
    "personality": "严格但公正，忠诚，有责任感",
    ...
  }
]
```

#### 获取单个 NPC

```http
GET /npcs/{npc_id}
```

#### 创建 NPC

```http
POST /npcs
Content-Type: application/json

{
  "npc_id": "npc_004",
  "name": "铁匠",
  ...
}
```

#### 更新 NPC

```http
PUT /npcs/{npc_id}
Content-Type: application/json

{
  "name": "铁匠大师",
  ...
}
```

#### 删除 NPC

```http
DELETE /npcs/{npc_id}
```

### 对话 API

#### 发送消息

```http
POST /chat
Content-Type: application/json

{
  "npcId": "npc_001",
  "message": "你好",
  "playerId": "player_123",
  "context": {}
}
```

**响应示例：**

```json
{
  "reply": "[守卫]（严肃地）: 你好? 作为城市守卫...",
  "action": {
    "type": "nod"
  },
  "emotion": "严肃",
  "npc_info": {
    "name": "守卫",
    "personality": "严格但公正，忠诚，有责任感",
    "background": "城市守卫，负责维护城市治安..."
  }
}
```

### 任务 API

#### 生成任务

```http
POST /task
Content-Type: application/json

{
  "npcId": "npc_001",
  "playerId": "player_123"
}
```

---

## 🛠 技术栈

### 后端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Python | 3.10+ | 编程语言 |
| FastAPI | 0.110+ | Web 框架 |
| Pydantic | 2.10+ | 数据验证 |
| LangChain | 0.1+ | LLM 集成框架 |
| Uvicorn | 0.27+ | ASGI 服务器 |

### 前端技术

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.2+ | UI 框架 |
| TypeScript | 5.2+ | 类型安全 |
| Ant Design | 5.12+ | UI 组件库 |
| Vite | 5.0+ | 构建工具 |
| React Router | 6.20+ | 路由管理 |
| ECharts | 5.5+ | 图表库 |

---

## ⚙️ 配置说明

### 环境变量

创建 `.env` 文件（可选）：

```env
# 后端配置
API_HOST=0.0.0.0
API_PORT=8000

# LLM 配置（如使用 OpenAI）
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4

# 数据库配置（可选）
MONGODB_URI=mongodb://localhost:27017
REDIS_URI=redis://localhost:6379
```

### 前端配置

修改 `frontend/vite.config.ts`：

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
```

---

## 👨‍💻 开发指南

### 开发模式

```bash
# 后端开发模式（自动重载）
cd backend_python
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 前端开发模式
cd frontend
npm run dev
```

### 构建生产版本

```bash
# 构建前端
cd frontend
npm run build

# 构建产物在 frontend/dist 目录
```

### 代码规范

- Python: 遵循 PEP 8 规范
- TypeScript/React: 使用 ESLint + Prettier

---

## 🗺 路线图

- [x] NPC 基础管理功能
- [x] 实时对话测试
- [x] 数据统计展示
- [ ] 接入真实 LLM（OpenAI/本地模型）
- [ ] 用户认证系统
- [ ] 对话历史持久化
- [ ] NPC 行为树编辑器
- [ ] 多语言支持
- [ ] Docker 部署支持
- [ ] WebSocket 实时通信

---

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- 项目地址: [GitHub](https://github.com/SkyCrown111/ai-npc-management-system)
- 问题反馈: [Issues](https://github.com/SkyCrown111/ai-npc-management-system/issues)

---

<div align="center">

**⭐ 如果这个项目对你有帮助，请给一个 Star！⭐**

Made with ❤️ by AI NPC Team

</div>
