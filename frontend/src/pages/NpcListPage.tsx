import React from 'react'
import { Card, Col, Row, Statistic, Table, Tag, Typography } from 'antd'

const { Title } = Typography

type NpcRow = {
  key: string
  npcId: string
  name: string
  status: '在线' | '离线'
  lastInteraction: string
  personality: string
}

export default function NpcListPage() {
  const columns = [
    { title: 'NPC ID', dataIndex: 'npcId', key: 'npcId' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: NpcRow['status']) => (
        <Tag color={status === '在线' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    { title: '最近交互', dataIndex: 'lastInteraction', key: 'lastInteraction' },
    { title: '性格', dataIndex: 'personality', key: 'personality' },
  ]

  const data: NpcRow[] = [
    {
      key: '1',
      npcId: 'npc_001',
      name: '守卫',
      status: '在线',
      lastInteraction: '2026-03-30 14:00',
      personality: '严格但公正',
    },
    {
      key: '2',
      npcId: 'npc_002',
      name: '商贩',
      status: '离线',
      lastInteraction: '2026-03-29 10:00',
      personality: '精明',
    },
  ]

  return (
    <div style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>
        NPC 总览
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="在线 NPC" value={1} suffix="/ 2" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="近 24 小时交互次数" value={1520} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="平均响应时间" value={245} suffix="ms" />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 24 }}>
        <Title level={4} style={{ marginTop: 0 }}>NPC 列表</Title>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  )
}
