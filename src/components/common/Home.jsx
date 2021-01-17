import React from 'react'
import {Col, Row} from 'antd'

import Login from '../../modules/login/Login'

const Home = () => {
    return (
        <Row className='centerContainer' style={{ width: '100%' }}>
            <Col span={24}>
                <Login/>
            </Col>
            <Col span={14} offset={5}>
                <h2>管理功能</h2>

                <h3>小程序</h3>
                <ul>
                    <li>菜单标签</li>
                </ul>
                <h3>用户管理</h3>
                <ul>
                    <li>博主管理</li>
                    <li>我管理的博主</li>
                </ul>
                <h3>内容管理</h3>
                <ul>
                    <li>视频内容</li>
                </ul>
                <h3>推荐策略</h3>
                <ul>
                    <li>热点召回</li>
                    <li>推荐默认参数</li>
                    <li>分级标签字典</li>
                </ul>
            </Col>
        </Row>
    )
}

export default Home
