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
                    <h2 style={{ color: 'white' }}>GR-Leantime</h2>
                </Link>
            </header>
            <Menu theme='dark'>
                <SubMenu title={<span><WechatOutlined/><span>Project</span></span>}>
                    <Item key='1.1'>
                        <Link to='/weapptabs'><span> Project </span></Link>
                    </Item>
                    <Item key='1.2'>
                        <Link to='/weapptabs'><span> Dashboard </span></Link>
                    </Item>
                    <Item key='1.3'>
                        <Link to='/weapptabs'><span> Ticket </span></Link>
                    </Item>
                    <Item key='1.4'>
                        <Link to='/weapptabs'><span> Milestone </span></Link>
                    </Item>
                    <Item key='1.5'>
                        <Link to='/weapptabs'><span> Sprint </span></Link>
                    </Item>
                    <Item key='1.6'>
                        <Link to='/weapptabs'><span> Timesheet </span></Link>
                    </Item>
                    <Item key='1.7'>
                        <Link to='/weapptabs'><span> Research </span></Link>
                    </Item>
                    <Item key='1.7'>
                        <Link to='/weapptabs'><span> Idea </span></Link>
                    </Item>
                    <Item key='1.7'>
                        <Link to='/weapptabs'><span> Retrospective </span></Link>
                    </Item>
                    <Item key='1.8'>
                        <Link to='/weapptabs'><span> Chart </span></Link>
                    </Item>
                    <Item key='1.9'>
                        <Link to='/weapptabs'><span> Project Info </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><UsergroupAddOutlined/><span>User</span></span>}>
                    <Item key='2.1'>
                        <Link to='/bloggers'><span> Tenant </span></Link>
                    </Item>
                    <Item key='2.2'>
                        <Link to='/bloggers'><span> Group </span></Link>
                    </Item>
                    <Item key='2.3'>
                        <Link to='/mybloggers'><span> Member </span></Link>
                    </Item>
                    <Item key='2.4'>
                        <Link to='/mybloggers'><span> Client </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><VideoCameraOutlined/><span> Mine </span></span>}>
                    <Item key='3.1'>
                        <Link to='/videos'><span> Calendar </span></Link>
                    </Item>
                    <Item key='3.2'>
                        <Link to='/playlists'><span> Timesheet </span></Link>
                    </Item>
                    <Item key='3.3'>
                        <Link to='/aliyunVod'><span> Portfolio </span></Link>
                    </Item>
                    <Item key='3.4'>
                        <Link to='/aliyunVod'><span> Report </span></Link>
                    </Item>
                </SubMenu>
                <SubMenu title={<span><VideoCameraOutlined/><span> Admin </span></span>}>
                    <Item key='4.1'>
                        <Link to='/tenants'><span> Tenant </span></Link>
                    </Item>
                </SubMenu>
            </Menu>
        </div>
    )
}

export default SideBar
