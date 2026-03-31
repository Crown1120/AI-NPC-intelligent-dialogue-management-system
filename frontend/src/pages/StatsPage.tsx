import React from 'react'
import { Card, Col, Row, Statistic, Typography } from 'antd'
import ReactECharts from 'echarts-for-react'

const { Title } = Typography

export default function StatsPage() {
  const option = {
    title: { text: '交互趋势（示例数据）' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'] },
    yAxis: { type: 'value' },
    series: [{ name: '交互次数', type: 'line', data: [120, 132, 101, 134, 90, 230, 210] }],
  }

  return (
    <div style={{ padding: 24, minHeight: 'calc(100vh - 64px)' }}>
      <Title level={2} style={{ marginTop: 0, marginBottom: 24 }}>
        指标统计
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="响应成功率" value={99.2} precision={1} suffix="%" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="平均响应时间" value={245} suffix="ms" />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="近 24 小时调用次数" value={1520} />
          </Card>
        </Col>
      </Row>
      <Card style={{ marginTop: 24 }} title="Agent 性能趋势">
        <ReactECharts option={option} />
      </Card>
    </div>
  )
}
