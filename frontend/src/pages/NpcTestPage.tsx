import React, { useState, useEffect, useRef } from 'react'
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Space,
  Switch,
  Tag,
  Typography,
  Divider,
  Spin,
  Popconfirm,
  Avatar,
  Tooltip,
  Empty,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  MessageOutlined,
  PlusOutlined,
  RobotOutlined,
  UserOutlined,
  SendOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

type NPCConfig = {
  npc_id: string
  name: string
  personality: string
  background: string
  speaking_style: string
  knowledge: string[]
  emotional_range: string[]
  default_emotion: string
  is_active: boolean
  created_at?: string
  updated_at?: string
}

type ChatMessage = {
  role: 'player' | 'npc'
  content: string
  emotion?: string
  action?: string
}

const API_BASE = 'http://localhost:8000'

const npcColors = ['#1890ff', '#52c41a', '#faad14', '#eb2f96', '#722ed1', '#13c2c2']

export default function NpcTestPage() {
  const [npcs, setNpcs] = useState<NPCConfig[]>([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingNpc, setEditingNpc] = useState<NPCConfig | null>(null)
  const [form] = Form.useForm()
  const [selectedNpc, setSelectedNpc] = useState<NPCConfig | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const fetchNpcs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/npcs`)
      const data = await response.json()
      setNpcs(data)
    } catch (error) {
      message.error('获取NPC列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNpcs()
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  const handleCreate = () => {
    setEditingNpc(null)
    form.resetFields()
    form.setFieldsValue({
      knowledge: '',
      emotional_range: '',
      is_active: true,
    })
    setModalVisible(true)
  }

  const handleEdit = (npc: NPCConfig, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setEditingNpc(npc)
    form.setFieldsValue({
      ...npc,
      knowledge: npc.knowledge.join(', '),
      emotional_range: npc.emotional_range.join(', '),
    })
    setModalVisible(true)
  }

  const handleDelete = async (npcId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    try {
      const response = await fetch(`${API_BASE}/npcs/${npcId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        message.success('NPC删除成功')
        fetchNpcs()
        if (selectedNpc?.npc_id === npcId) {
          setSelectedNpc(null)
          setChatMessages([])
        }
      } else {
        message.error('删除失败')
      }
    } catch (error) {
      message.error('删除失败')
    }
  }

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields()
      const npcData: NPCConfig = {
        ...values,
        npc_id: editingNpc?.npc_id || values.npc_id,
        knowledge: values.knowledge
          ? values.knowledge
              .split(',')
              .map((k: string) => k.trim())
              .filter((k: string) => k)
          : [],
        emotional_range: values.emotional_range
          ? values.emotional_range
              .split(',')
              .map((e: string) => e.trim())
              .filter((e: string) => e)
          : [],
      }

      const url = editingNpc ? `${API_BASE}/npcs/${editingNpc.npc_id}` : `${API_BASE}/npcs`
      const method = editingNpc ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(npcData),
      })

      if (response.ok) {
        message.success(editingNpc ? 'NPC更新成功' : 'NPC创建成功')
        setModalVisible(false)
        fetchNpcs()
      } else {
        const error = await response.json()
        message.error(error.detail || '操作失败')
      }
    } catch (error) {
      message.error('表单验证失败')
    }
  }

  const handleChat = async () => {
    if (!chatInput.trim() || !selectedNpc) return

    const playerMessage = chatInput.trim()
    setChatMessages((prev) => [...prev, { role: 'player', content: playerMessage }])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          npcId: selectedNpc.npc_id,
          message: playerMessage,
          playerId: 'test_player',
        }),
      })

      const data = await response.json()
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'npc',
          content: data.reply,
          emotion: data.emotion,
          action: data.action?.type,
        },
      ])
    } catch (error) {
      message.error('对话失败')
    } finally {
      setChatLoading(false)
    }
  }

  const selectNpc = (npc: NPCConfig) => {
    setSelectedNpc(npc)
    setChatMessages([])
  }

  const getNpcColor = (index: number) => npcColors[index % npcColors.length]

  return (
    <div style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>
        NPC 设置与测试
      </Title>

      <Row gutter={24}>
        <Col span={10}>
          <Card
            title={
              <Space>
                <RobotOutlined />
                <span>NPC 列表</span>
                <Tag color="blue">{npcs.length} 个</Tag>
              </Space>
            }
            extra={
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新建 NPC
              </Button>
            }
            styles={{ body: { padding: 16, maxHeight: 'calc(100vh - 220px)', overflow: 'auto' } }}
          >
            <Spin spinning={loading}>
              {npcs.length === 0 ? (
                <Empty description="暂无NPC，点击上方按钮创建" />
              ) : (
                <Row gutter={[12, 12]}>
                  {npcs.map((npc, index) => (
                    <Col span={24} key={npc.npc_id}>
                      <Card
                        hoverable
                        onClick={() => selectNpc(npc)}
                        style={{
                          border:
                            selectedNpc?.npc_id === npc.npc_id
                              ? `2px solid ${getNpcColor(index)}`
                              : '1px solid #d9d9d9',
                          background: selectedNpc?.npc_id === npc.npc_id ? '#e6f7ff' : '#fff',
                          transition: 'all 0.3s',
                        }}
                        styles={{ body: { padding: 12 } }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                          <Avatar
                            size={48}
                            style={{ backgroundColor: getNpcColor(index), flexShrink: 0 }}
                            icon={<RobotOutlined />}
                          >
                            {npc.name.charAt(0)}
                          </Avatar>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                              <Text strong style={{ fontSize: 16 }}>
                                {npc.name}
                              </Text>
                              <Tag color={npc.is_active ? 'success' : 'error'} style={{ margin: 0 }}>
                                {npc.is_active ? '在线' : '离线'}
                              </Tag>
                              {selectedNpc?.npc_id === npc.npc_id && (
                                <CheckCircleOutlined style={{ color: getNpcColor(index) }} />
                              )}
                            </div>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              ID: {npc.npc_id}
                            </Text>
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ margin: '8px 0 0', color: '#666', fontSize: 13 }}
                            >
                              {npc.personality}
                            </Paragraph>
                            <div style={{ marginTop: 8 }}>
                              <Space size={[4, 4]} wrap>
                                {npc.knowledge.slice(0, 3).map((k) => (
                                  <Tag key={k} style={{ margin: 0, fontSize: 11 }}>
                                    {k}
                                  </Tag>
                                ))}
                                {npc.knowledge.length > 3 && (
                                  <Tag style={{ margin: 0, fontSize: 11 }}>
                                    +{npc.knowledge.length - 3}
                                  </Tag>
                                )}
                              </Space>
                            </div>
                          </div>
                          <Space direction="vertical" size={4}>
                            <Tooltip title="编辑">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={(e) => handleEdit(npc, e)}
                              />
                            </Tooltip>
                            <Tooltip title="测试对话">
                              <Button
                                type="text"
                                size="small"
                                icon={<MessageOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  selectNpc(npc)
                                }}
                              />
                            </Tooltip>
                            <Popconfirm
                              title="确定删除此NPC?"
                              onConfirm={(e) => handleDelete(npc.npc_id, e as React.MouseEvent)}
                              onCancel={(e) => e?.stopPropagation()}
                            >
                              <Tooltip title="删除">
                                <Button
                                  type="text"
                                  size="small"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </Tooltip>
                            </Popconfirm>
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Spin>
          </Card>
        </Col>

        <Col span={14}>
          <Card
            title={
              selectedNpc ? (
                <Space>
                  <Avatar style={{ backgroundColor: '#1890ff' }} icon={<RobotOutlined />}>
                    {selectedNpc.name.charAt(0)}
                  </Avatar>
                  <span>与 {selectedNpc.name} 对话测试</span>
                </Space>
              ) : (
                <Space>
                  <MessageOutlined />
                  <span>对话测试</span>
                </Space>
              )
            }
            styles={{ body: { padding: 0 } }}
          >
            {selectedNpc ? (
              <>
                <div
                  style={{
                    height: 350,
                    overflow: 'auto',
                    padding: 16,
                    background: '#fafafa',
                  }}
                >
                  {chatMessages.length === 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#999',
                      }}
                    >
                      <RobotOutlined style={{ fontSize: 48, marginBottom: 16, color: '#1890ff' }} />
                      <Text>开始与 {selectedNpc.name} 对话吧！</Text>
                    </div>
                  ) : (
                    chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          justifyContent: msg.role === 'player' ? 'flex-end' : 'flex-start',
                          marginBottom: 16,
                        }}
                      >
                        {msg.role === 'npc' && (
                          <Avatar
                            size={36}
                            style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                            icon={<RobotOutlined />}
                          >
                            {selectedNpc.name.charAt(0)}
                          </Avatar>
                        )}
                        <div style={{ maxWidth: '65%' }}>
                          {msg.role === 'npc' && (
                            <div style={{ marginBottom: 4 }}>
                              <Tag color="blue" style={{ margin: 0 }}>
                                {selectedNpc.name}
                              </Tag>
                              {msg.emotion && (
                                <Tag color="orange" style={{ margin: '0 0 0 4px' }}>
                                  {msg.emotion}
                                </Tag>
                              )}
                              {msg.action && msg.action !== 'none' && (
                                <Tag color="green" style={{ margin: '0 0 0 4px' }}>
                                  动作: {msg.action}
                                </Tag>
                              )}
                            </div>
                          )}
                          <div
                            style={{
                              padding: '10px 14px',
                              borderRadius: 12,
                              background: msg.role === 'player' ? '#1890ff' : '#fff',
                              color: msg.role === 'player' ? '#fff' : '#333',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                            }}
                          >
                            {msg.content}
                          </div>
                        </div>
                        {msg.role === 'player' && (
                          <Avatar
                            size={36}
                            style={{ backgroundColor: '#87d068', marginLeft: 8 }}
                            icon={<UserOutlined />}
                          />
                        )}
                      </div>
                    ))
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div style={{ padding: 16, background: '#fff', borderTop: '1px solid #f0f0f0' }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      placeholder="输入消息..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onPressEnter={handleChat}
                      disabled={chatLoading}
                      size="large"
                    />
                    <Button
                      type="primary"
                      size="large"
                      icon={<SendOutlined />}
                      onClick={handleChat}
                      loading={chatLoading}
                    >
                      发送
                    </Button>
                  </Space.Compact>
                </div>

                <Divider style={{ margin: 0 }} />

                <div style={{ padding: 16, background: '#fff' }}>
                  <Title level={5} style={{ marginBottom: 12 }}>
                    NPC 详细信息
                  </Title>
                  <Row gutter={[16, 12]}>
                    <Col span={12}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          性格
                        </Text>
                        <div style={{ marginTop: 4 }}>{selectedNpc.personality}</div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          背景
                        </Text>
                        <div style={{ marginTop: 4 }}>{selectedNpc.background}</div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          说话风格
                        </Text>
                        <div style={{ marginTop: 4 }}>{selectedNpc.speaking_style}</div>
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          默认情绪
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Tag color="orange">{selectedNpc.default_emotion}</Tag>
                        </div>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          知识领域
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Space size={[4, 8]} wrap>
                            {selectedNpc.knowledge.map((k) => (
                              <Tag key={k} color="blue">
                                {k}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </Card>
                    </Col>
                    <Col span={24}>
                      <Card size="small" style={{ background: '#fafafa' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          情绪范围
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Space size={[4, 8]} wrap>
                            {selectedNpc.emotional_range.map((e) => (
                              <Tag key={e} color="orange">
                                {e}
                              </Tag>
                            ))}
                          </Space>
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 400,
                  color: '#999',
                }}
              >
                <RobotOutlined style={{ fontSize: 64, marginBottom: 24, color: '#d9d9d9' }} />
                <Text type="secondary" style={{ fontSize: 16 }}>
                  请从左侧选择一个NPC进行测试
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title={editingNpc ? '编辑 NPC' : '创建 NPC'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={650}
        okText="保存"
        cancelText="取消"
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="npc_id"
                label="NPC ID"
                rules={[{ required: true, message: '请输入NPC ID' }]}
              >
                <Input placeholder="例如: npc_001" disabled={!!editingNpc} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="例如: 守卫" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="personality"
            label="性格"
            rules={[{ required: true, message: '请输入性格' }]}
          >
            <TextArea rows={2} placeholder="例如: 严格但公正，忠诚，有责任感" />
          </Form.Item>

          <Form.Item
            name="background"
            label="背景"
            rules={[{ required: true, message: '请输入背景' }]}
          >
            <TextArea rows={2} placeholder="例如: 城市守卫，负责维护城市治安" />
          </Form.Item>

          <Form.Item
            name="speaking_style"
            label="说话风格"
            rules={[{ required: true, message: '请输入说话风格' }]}
          >
            <Input placeholder="例如: 正式、简洁，偶尔会使用军事术语" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="knowledge"
                label="知识领域"
                rules={[{ required: true, message: '请输入知识领域' }]}
                extra="多个知识用逗号分隔"
              >
                <Input placeholder="例如: 城市法规, 巡逻路线" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="emotional_range"
                label="情绪范围"
                rules={[{ required: true, message: '请输入情绪范围' }]}
                extra="多个情绪用逗号分隔"
              >
                <Input placeholder="例如: 严肃, 警惕, 友好" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="default_emotion"
                label="默认情绪"
                rules={[{ required: true, message: '请输入默认情绪' }]}
              >
                <Input placeholder="例如: 严肃" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="is_active" label="是否在线" valuePropName="checked">
                <Switch checkedChildren="在线" unCheckedChildren="离线" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
