# 运行手册（Windows 宿主机 + CentOS 7 VM）

本手册对应当前已跑通的部署形态：

- Windows 宿主机：运行 Java API 网关（8080）+ Python Agent（8000）
- CentOS 7 虚拟机：通过内网访问 Windows 宿主机的 API（192.168.222.1:8080）

该形态用于绕开 CentOS 7 上 Docker 拉镜像慢、JDK17 安装不便、Python 3.14 依赖编译复杂等问题。

---

## 端口与地址

- Python Agent（FastAPI）：`http://127.0.0.1:8000`（Windows 本机）
- Java API 网关（Spring Boot）：`http://127.0.0.1:8080`（Windows 本机）
- CentOS VM 访问 Windows 网关：`http://192.168.222.1:8080`

说明：`192.168.222.1` 为 Windows 宿主机在 VM 同网段的 IP（以你实际环境为准）。

---

## Windows 侧启动

### 1) 启动 Python Agent（8000）

在 Windows PowerShell：

```powershell
cd "D:\Ai agent\Ai agent_City lange\backend_python"
.\.venv\Scripts\activate
python main.py
```

验证（应返回 200 + JSON）：

```powershell
curl.exe -i -X POST "http://127.0.0.1:8000/chat" -H "Content-Type: application/json" -d "{\"npcId\":\"npc_001\",\"message\":\"ping\",\"playerId\":\"player_123\"}"
```

确认监听：

```powershell
netstat -ano | findstr ":8000"
```

### 2) 启动 Java 网关（8080）

在 Windows PowerShell：

```powershell
cd "D:\Ai agent\Ai agent_City lange\backend_java"

# 指向本机 Python Agent
$env:AGENT_PYTHON_URL = "http://127.0.0.1:8000"

# 使用本地 profile（不依赖 Mongo/Redis 运行也能启动）
.\mvnw.cmd -s .\settings-cn.xml spring-boot:run "-Dspring-boot.run.profiles=local"
```

验证端口监听：

```powershell
netstat -ano | findstr ":8080"
```

---

## CentOS 7 VM 侧验证（调用 Windows 网关）

### 1) 登录获取 JWT

```bash
curl -s -X POST http://192.168.222.1:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

返回示例：

```json
{"username":"admin","token":"<JWT>","tokenType":"Bearer"}
```

### 2) 带 JWT 调用 NPC 对话

```bash
TOKEN='<把上一步返回的 token 粘贴到这里>'

curl -i -X POST http://192.168.222.1:8080/api/v1/npc/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"npcId":"npc_001","message":"你好","playerId":"player_123"}'
```

成功返回示例：

```json
{"reply":"...","action":{"type":"none"},"emotion":"neutral"}
```

---

## 接口规范（当前实现）

### POST /api/v1/auth/login

请求：

```json
{"username":"admin","password":"admin123"}
```

响应（200）：

```json
{"token":"<jwt>","tokenType":"Bearer","username":"admin"}
```

### POST /api/v1/npc/chat

Headers：

- `Authorization: Bearer <jwt>`
- `Content-Type: application/json`

请求：

```json
{
  "npcId": "npc_001",
  "message": "你好",
  "playerId": "player_123",
  "context": {
    "location": "bar",
    "reputation": 50
  }
}
```

响应（200）：

```json
{
  "reply": "…",
  "action": { "type": "none" },
  "emotion": "neutral"
}
```

### POST /api/v1/npc/task

Headers 同上。

请求：

```json
{"npcId":"npc_001","playerId":"player_123"}
```

响应（200）：

```json
{"taskId":"...","title":"...","description":"...","reward":{"exp":100,"money":50}}
```

---

## 常见问题排查

### A) VM 调用 192.168.222.1:8080 连接失败

- 确认 Windows 网关进程仍在运行（不要关闭 `spring-boot:run` 的窗口）
- 检查 Windows 防火墙是否阻止 8080 入站（可放行 8080 TCP）

### B) 网关返回 502（Bad Gateway）

含义：网关转发到 Python Agent 失败。

- 确认 Python 8000 在 Windows 本机监听：`netstat -ano | findstr ":8000"`
- 确认网关启动前已设置：`$env:AGENT_PYTHON_URL="http://127.0.0.1:8000"`

### C) 在 PowerShell 用 curl 出现 Headers 解析错误

PowerShell 下建议用 `Invoke-RestMethod`，或显式使用 `curl.exe`。

---

## 代码位置

- Python Agent：`backend_python/`
- Java 网关：`backend_java/`
- 运行配置（本地 profile）：`backend_java/src/main/resources/application-local.yml`

