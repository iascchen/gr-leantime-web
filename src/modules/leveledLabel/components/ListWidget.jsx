import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Popconfirm, Table} from 'antd'
import {DeleteFilled, EditTwoTone, PlusOutlined, UserOutlined, VideoCameraOutlined} from '@ant-design/icons'
import {Link} from 'react-router-dom'


export const DEFAULT_PAGE_SIZE = 10
export const LABEL_DEPTH = 3   // level depth value from 0, so it is 4 levels

const ListWidget = ({ list, onDeleted, onEdit, pageSize, onRefetch, onCreateSub }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: 'Target',
                width: '15%',
                render: (text, record) => {
                    return <span>{record.target === 1 ? <VideoCameraOutlined/> : <UserOutlined/>}</span>
                }
            }, {
                title: 'Name',
                dataIndex: 'name',
                width: '20%',
            }, {
                title: 'Parent Path',
                width: '30%',
                dataIndex: 'path',
                // }, {
                //     title: 'Parent Ids',
                //     width: '35%',
                //     dataIndex: 'parentIds',
                //     render: (text, record) => {
                //         return <span>{record.parentIds},{record.id}</span>
                //     }
            }, {
                title: 'Actions',
                width: '20%',
                render: (text, record) => {
                    return <span>
                        {(record.children && record.children.length === 0) &&
                        <Popconfirm title={`非常危险：此操作会删除其所有下级子标签！是否删除?  ${record.name}`}
                            okText={'删除'} cancelText={'取消'} onConfirm={() => {
                                handleDelete(record.id || record._id)
                            }}>
                            <Button type={'danger'} shape='circle'><DeleteFilled/></Button>
                        </Popconfirm>
                        }
                        &nbsp;
                        <Link to={'/labels/' + (record.id || record._id)} target='label_edit'>
                            <Button shape='circle'><EditTwoTone/></Button>
                        </Link>
                        &nbsp;
                        {(record.level < LABEL_DEPTH) &&
                        <Button shape='circle' onClick={() => handleCreateSub(record.id || record._id)}>
                            <PlusOutlined/>
                        </Button>
                        }
                    </span>
                }
            }]
        setColumns(_columns)
    }, [])

    const handleDelete = (id) => {
        if (onDeleted) {
            onDeleted(id)
        }
    }

    const handleEdit = (id) => {
        if (onEdit) {
            onEdit(id)
        }
    }

    const handleCreateSub = (id) => {
        if (onCreateSub) {
            onCreateSub(id)
        }
    }

    const handleTableChange = (pagination) => {
        onRefetch && onRefetch(pagination)
    }

    return (
        <div className='centerContainer' style={{ width: '100%' }}>
            <Table columns={sColumns} dataSource={list.entities || []} style={{ width: '100%' }}
                pagination={{ pageSize: pageSize || DEFAULT_PAGE_SIZE, total: list.total }}
                onChange={handleTableChange}/>
        </div>
    )
}

ListWidget.propTypes = {
    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
    onCreateSub: PropTypes.func,
    pageSize: PropTypes.number,
    list: PropTypes.any,
}

export default ListWidget
