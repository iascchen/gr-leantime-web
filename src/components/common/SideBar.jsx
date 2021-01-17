import React from 'react'
import {Link} from 'react-router-dom'
import {Menu} from 'antd'
import {
    BarsOutlined,
    FieldTimeOutlined,
    UsergroupAddOutlined,
    VideoCameraOutlined,
    WechatOutlined
} from '@ant-design/icons'

const { Item, SubMenu } = Menu

const SideBar = () => {
    return (
        <div>
            <header className='App-header'>
                <Link to='/'>
                    <h2 style={{ color: 'white' }}>正当年</h2>
                </Link>
            </header>
            <Menu theme='dark'>
                <SubMenu title={<span><WechatOutlined/><span>小程序</span></span>}>
                    <Item key='1.1'>
                        <Link to='/weapptabs'><span> 频道 </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><UsergroupAddOutlined/><span>博主管理</span></span>}>
                    <Item key='2.1'>
                        <Link to='/bloggers'><span> 博主管理 </span></Link>
                    </Item>
                    <Item key='2.2'>
                        <Link to='/mybloggers'><span> 我管理的博主 </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><VideoCameraOutlined/><span>内容管理</span></span>}>
                    <Item key='3.1'>
                        <Link to='/videos'><span> 视频内容 </span></Link>
                    </Item>
                    <Item key='3.3'>
                        <Link to='/playlists'><span> 视频专辑 </span></Link>
                    </Item>
                    <Item key='3.2'>
                        <Link to='/aliyunVod'><span> Aliyun VOD 清理 </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><FieldTimeOutlined/><span>分发管理</span></span>}>
                    <Item key='6.1'>
                        <Link to='/myprompts'><span> 分发记录 </span></Link>
                    </Item>
                    <Item key='6.2'>
                        <Link to='/prompters'><span> 分发账号管理 </span></Link>
                    </Item>
                    <Item key='6.3'>
                        <Link to='/myprompters'><span> 我管理的分发账号 </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><BarsOutlined/><span>推荐策略</span></span>}>
                    <Item key='4.1'>
                        <Link to='/recommend/hot'><span> 热点召回 </span></Link>
                    </Item>
                    <Item key='4.2'>
                        <Link to='/recommend/defaults'><span> 推荐默认参数 </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><BarsOutlined/><span>标签管理</span></span>}>
                    <Item key='5.1'>
                        <Link to='/labels'><span> 分级标签字典 </span></Link>
                    </Item>
                </SubMenu>
            </Menu>
        </div>
    )
}

export default SideBar
