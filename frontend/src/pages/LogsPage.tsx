import React from 'react'
import { Card, Table, Tag, Typography } from 'antd'

const { Title } = Typography

type LogRow = {
  key: string
  time: string
  npcId: string
  playerId: string
  message: string
  reply: string
  emotion: '友好' | '中立' | '警惕'
}

export default function LogsPage() {
  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 170 },
    { title: 'NPC', dataIndex: 'npcId', key: 'npcId', width: 120 },
    { title: '玩家', dataIndex: 'playerId', key: 'playerId', width: 120 },
    { title: '玩家发言', dataIndex: 'message', key: 'message' },
    { title: 'NPC 回复', dataIndex: 'reply', key: 'reply' },
    {
      title: '情绪',
      dataIndex: 'emotion',
      key: 'emotion',
      width: 100,
      render: (emotion: LogRow['emotion']) => {
        const color = emotion === '友好' ? 'green' : emotion === '警惕' ? 'red' : 'blue'
        return <Tag color={color}>{emotion}</Tag>
      },
    },
  ]

  const data: LogRow[] = [
    {
      key: '1',
      time: '2026-03-31 23:45',
      npcId: 'npc_001',
      playerId: 'player_123',
      message: '你好',
      reply: '你好，市民。',
      emotion: '中立',
    },
    {
      key: '2',
      time: '2026-03-31 23:46',
      npcId: 'npc_001',
      playerId: 'player_123',
      message: '给我一个任务',
      reply: '去酒吧附近找一把丢失的钥匙。',
      emotion: '友好',
    },
  ]

  return (
    <div style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>
        对话日志
      </Title>
      <Card>
        <Table columns={columns} dataSource={data} scroll={{ x: 1000 }} />
      </Card>
    </div>
  )
}
