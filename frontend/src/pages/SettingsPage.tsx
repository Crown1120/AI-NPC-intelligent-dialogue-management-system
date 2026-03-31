import React from 'react'
import { Button, Card, Form, Input, Select, Space, Typography } from 'antd'

const { Title } = Typography

export default function SettingsPage() {
  return (
    <div style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>
        系统设置
      </Title>
      <Card title="网关与模型配置（示例）">
        <Form layout="vertical" initialValues={{ gateway: '/api', model: 'mock' }}>
          <Form.Item label="API 网关前缀" name="gateway">
            <Input placeholder="/api" />
          </Form.Item>
          <Form.Item label="模型来源" name="model">
            <Select
              options={[
                { label: 'Mock（演示）', value: 'mock' },
                { label: 'OpenAI（待接入）', value: 'openai' },
                { label: '本地模型（待接入）', value: 'local' },
              ]}
            />
          </Form.Item>
          <Form.Item label="JWT 说明">
            <Input.TextArea
              rows={3}
              value="当前版本由网关签发 JWT，前端需要在请求头中携带 Authorization: Bearer <token>。"
              readOnly
            />
          </Form.Item>
          <Space>
            <Button type="primary">保存</Button>
            <Button>重置</Button>
          </Space>
        </Form>
      </Card>
    </div>
  )
}
