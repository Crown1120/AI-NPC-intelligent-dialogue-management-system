# 贡献指南

感谢您考虑为 AI NPC 智能对话管理系统做出贡献！

## 📋 目录

- [行为准则](#行为准则)
- [如何贡献](#如何贡献)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交信息规范](#提交信息规范)
- [Pull Request 流程](#pull-request-流程)

---

## 行为准则

本项目采用贡献者公约作为行为准则。参与此项目即表示您同意遵守其条款。

---

## 如何贡献

### 报告 Bug

如果您发现了 bug，请创建一个 [Issue](../../issues)，包含以下信息：

- **标题**：简洁描述问题
- **描述**：详细说明问题发生的情况
- **复现步骤**：
  1. 步骤一
  2. 步骤二
  3. ...
- **期望行为**：应该发生什么
- **实际行为**：实际发生了什么
- **环境信息**：
  - 操作系统：[例如 Windows 11]
  - Python 版本：[例如 3.10.0]
  - Node.js 版本：[例如 18.0.0]
- **截图**：如果适用，添加截图

### 建议新功能

如果您有新功能的建议，请创建一个 [Issue](../../issues)，包含：

- **标题**：清晰描述建议的功能
- **描述**：详细说明功能需求
- **用例**：描述这个功能如何使用
- **替代方案**：描述您考虑过的替代方案

---

## 开发流程

### 1. Fork 仓库

点击页面右上角的 "Fork" 按钮。

### 2. 克隆仓库

```bash
git clone https://github.com/your-username/ai-npc-management-system.git
cd ai-npc-management-system
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
```

分支命名规范：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构
- `test/` - 测试相关

### 4. 安装依赖

```bash
# 后端
cd backend_python
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate  # Linux/macOS
pip install -r requirements.txt

# 前端
cd ../frontend
npm install
```

### 5. 进行开发

编写代码，确保遵循代码规范。

### 6. 测试

```bash
# 后端测试
cd backend_python
pytest

# 前端测试
cd frontend
npm run test
```

### 7. 提交更改

```bash
git add .
git commit -m "feat: 添加新功能描述"
```

### 8. 推送分支

```bash
git push origin feature/your-feature-name
```

### 9. 创建 Pull Request

前往 GitHub 页面，点击 "New Pull Request"。

---

## 代码规范

### Python 代码规范

- 遵循 [PEP 8](https://pep8.org/) 规范
- 使用 4 个空格缩进
- 使用类型注解
- 编写文档字符串

```python
def get_npc(npc_id: str) -> Optional[NPCConfig]:
    """
    根据 ID 获取 NPC 配置。
    
    Args:
        npc_id: NPC 的唯一标识符
        
    Returns:
        NPC 配置对象，如果不存在则返回 None
    """
    pass
```

### TypeScript/React 代码规范

- 使用函数组件和 Hooks
- 使用 TypeScript 类型定义
- 组件命名使用 PascalCase
- 使用 ESLint 和 Prettier

```typescript
interface NPCConfig {
  npc_id: string
  name: string
  // ...
}

export default function NpcCard({ npc }: { npc: NPCConfig }) {
  // ...
}
```

---

## 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| 类型 | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响功能） |
| `refactor` | 代码重构 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |

### 示例

```
feat(npc): 添加 NPC 情绪系统

- 实现情绪状态机
- 添加情绪转换逻辑
- 更新 UI 显示情绪状态

Closes #123
```

---

## Pull Request 流程

1. 确保 PR 标题清晰描述更改内容
2. 在 PR 描述中说明：
   - 更改了什么
   - 为什么需要这个更改
   - 如何测试
3. 关联相关的 Issue
4. 等待代码审查
5. 根据反馈进行修改
6. 合并后删除分支

---

## 需要帮助？

如果您有任何问题，可以：
- 创建 [Issue](../../issues)
- 发送邮件至项目维护者

感谢您的贡献！🎉
