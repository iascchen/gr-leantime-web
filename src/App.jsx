import React, {useState} from 'react'
import {HashRouter as Router} from 'react-router-dom'
import {Layout} from 'antd'

import './App.css'
import SideBar from './components/common/SideBar'
import BodyContainer from './components/common/BodyContainer'
import HeaderContainer from './components/common/HeaderContainer'

const { Content, Header, Sider, Footer } = Layout

const App = () => {
    const [sCollapsed, setCollapsed] = useState(false)

    const onCollapse = () => {
        setCollapsed(collapsed => !collapsed)
    }

    return (
        <Layout>
            <Router>
                <Sider collapsible collapsed={sCollapsed} onCollapse={onCollapse}>
                    <SideBar/>
                </Sider>
                <Layout className='site-layout'>
                    <Header style={{ background: '#fff', padding: '0' }}>
                        <HeaderContainer title={' GR-Leantime '}/>
                    </Header>
                    <Content style={{ margin: '16px' }}>
                        <BodyContainer/>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>©2021 Created by Iasc CHEN(iasc@163.com)</Footer>
                </Layout>
            </Router>
        </Layout>
    )
}

export default App
