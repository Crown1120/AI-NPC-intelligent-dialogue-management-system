import React, { useMemo, useState } from 'react'
import { Breadcrumb, Layout, Menu, Typography } from 'antd'
import { FileTextOutlined, LineChartOutlined, RobotOutlined, SettingOutlined, ExperimentOutlined } from '@ant-design/icons'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { LogsPage, NpcListPage, NpcTestPage, SettingsPage, StatsPage } from './pages'

const { Header, Content, Sider } = Layout
const { Title } = Typography

type NavItem = {
  key: string
  label: string
  icon: React.ReactNode
  path: string
  breadcrumb: string[]
}

const navItems: NavItem[] = [
  { key: 'npc', label: 'NPC 列表', icon: <RobotOutlined />, path: '/npc', breadcrumb: ['首页', 'NPC 列表'] },
  { key: 'npc-test', label: 'NPC 设置与测试', icon: <ExperimentOutlined />, path: '/npc-test', breadcrumb: ['首页', 'NPC 设置与测试'] },
  { key: 'logs', label: '对话日志', icon: <FileTextOutlined />, path: '/logs', breadcrumb: ['首页', '对话日志'] },
  { key: 'stats', label: '指标统计', icon: <LineChartOutlined />, path: '/stats', breadcrumb: ['首页', '指标统计'] },
  { key: 'settings', label: '系统设置', icon: <SettingOutlined />, path: '/settings', breadcrumb: ['首页', '系统设置'] },
]

function Shell() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const activeKey = useMemo(() => {
    const exactMatch = navItems.find((i) => location.pathname === i.path)
    if (exactMatch) return exactMatch.key
    const prefixMatch = navItems.find((i) => location.pathname.startsWith(i.path + '/'))
    if (prefixMatch) return prefixMatch.key
    const fallback = navItems.find((i) => location.pathname.startsWith(i.path))
    return fallback?.key ?? 'npc'
  }, [location.pathname])

  const breadcrumb = useMemo(() => {
    const item = navItems.find((i) => i.key === activeKey)
    return item?.breadcrumb ?? ['首页']
  }, [activeKey])

  const currentPageTitle = useMemo(() => {
    const item = navItems.find((i) => i.key === activeKey)
    return item?.label ?? ''
  }, [activeKey])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 64,
            margin: 0,
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            textAlign: 'center',
            lineHeight: '64px',
            userSelect: 'none',
            fontWeight: 'bold',
            fontSize: collapsed ? 14 : 16,
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {collapsed ? 'NPC' : 'AI NPC 管理'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[activeKey]}
          mode="inline"
          items={navItems.map((i) => ({ key: i.key, icon: i.icon, label: i.label }))}
          onClick={(e) => {
            const item = navItems.find((i) => i.key === e.key)
            if (item) navigate(item.path)
          }}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <Header 
          style={{ 
            padding: '0 24px', 
            background: '#fff', 
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Breadcrumb items={breadcrumb.map((b) => ({ title: b }))} />
          <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
            {currentPageTitle}
          </Title>
        </Header>
        <Content style={{ 
          margin: 0, 
          minHeight: 'calc(100vh - 64px)',
          background: '#f0f2f5',
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/npc-test" replace />} />
            <Route path="/npc" element={<NpcListPage />} />
            <Route path="/npc-test" element={<NpcTestPage />} />
            <Route path="/logs" element={<LogsPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route
              path="*"
              element={
                <div style={{ padding: 24, background: '#fff', margin: 24, borderRadius: 8 }}>
                  <Title level={4} style={{ margin: 0 }}>
                    页面不存在
                  </Title>
                </div>
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
