import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Button, Popconfirm, Table} from 'antd'
import {DeleteFilled, EditTwoTone} from '@ant-design/icons'
import {Link} from 'react-router-dom'

export const DEFAULT_PAGE_SIZE = 10

const ListWidget = ({ list, pageSize, onDeleted, onEdit, onRefetch }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: 'Video',
                width: '10%',
                render: (text, record) => {
                    return <div className='centerContainer'><img src={record.video.cover_path} alt={record.video.title}
                        height={80}/></div>
                }
            }, {
                title: 'Title',
                width: '10%',
                render: (text, record) => {
                    return <span>{record.video.title}</span>
                }
            }, {
                title: 'Play(K)',
                width: '10%',
                dataIndex: 'playCount',
            }, {
                title: 'Share(K)',
                width: '10%',
                dataIndex: 'shareCount',
            }, {
                title: 'Like(K)',
                width: '10%',
                dataIndex: 'likeCount',
            }, {
                title: 'Adjust Weight',
                width: '10%',
                dataIndex: 'weight',
            }, {
                title: 'Hot Attenuation(Days)',
                width: '10%',
                dataIndex: 'attenuation',
            }, {
                title: 'Actions',
                width: '10%',
                render: (text, record) => {
                    return <span>
                        <Popconfirm title={`是否删除 "${record.video.title}" 的相关推荐调整`} okText={'删除'} cancelText={'取消'}
                            onConfirm={() => {
                                handleDelete(record.id || record._id)
                            }}>
                            <Button type={'danger'} shape='circle'><DeleteFilled/></Button>
                        </Popconfirm>
                        &nbsp;
                        <Link to={'/recommend/hot/' + record.videoId} target='hot_edit'>
                            <Button shape='circle'><EditTwoTone/></Button>
                        </Link>
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

    const handleTableChange = (pagination) => {
        onRefetch && onRefetch(pagination)
    }

    return (
        <div className='centerContainer' style={{ width: '100%' }}>
            <Table columns={sColumns} dataSource={list.entities || []} style={{ width: '100%' }}
                pagination={{ pageSize: pageSize || DEFAULT_PAGE_SIZE, total: list.total }}
                onChange={handleTableChange}
            />
        </div>
    )
}

ListWidget.propTypes = {
    list: PropTypes.any,
    pageSize: PropTypes.number,

    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
}

export default ListWidget
