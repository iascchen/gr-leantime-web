import React, {useEffect, useState} from 'react'
import {Button, Popconfirm, Table} from 'antd'
import {DeleteFilled, EditTwoTone} from '@ant-design/icons'
import {Link} from 'react-router-dom'
import moment from 'moment'
import PropTypes from 'prop-types'

export const DEFAULT_PAGE_SIZE = 10
const DATE_FORMAT = 'YYYY/MM/DD 日 HH 时'

const ListWidget = ({ list, pageSize, onDeleted, onEdit, onRefetch }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: '分发时段',
                width: '10%',
                render: (text, record) => {
                    return <>{moment(record.promptAt).format(DATE_FORMAT)}</>
                }
            }, {
                title: 'promptObject',
                dataIndex: 'promptObject',
                width: '5%',
            }, {
                title: 'Video',
                width: '10%',
                render: (text, record) => {
                    const title = (record.video && record.video.title) || (record.playlist && record.playlist.title)
                    const src = (record.video && record.video.cover_path) || (record.playlist && record.playlist.cover)
                    return <div className='centerContainer'><img src={src}
                        alt={title}
                        height={80}/></div>
                }
            }, {
                title: 'Title',
                width: '10%',
                render: (text, record) => {
                    const title = (record.video && record.video.title) || (record.playlist && record.playlist.title)
                    return <span>{title}</span>
                }
                // }, {
                //     title: 'Tool',
                //     dataIndex: 'promptTool',
                //     width: '5%',
                // }, {
                //     title: 'Type',
                //     dataIndex: 'promptType',
                //     width: '5%',
            }, {
                title: 'Prompter',
                width: '5%',
                render: (text, record) => {
                    return <span>{record.prompter.name}</span>
                }
            }, {
                title: 'TargetType',
                dataIndex: 'targetType',
                width: '5%',
                // },{
                //     title: 'Desc',
                //     dataIndex: 'desc',
                //     width: '5%',
            }, {
                title: 'Groups',
                dataIndex: 'groupCount',
                width: '5%',
            }, {
                title: 'People',
                dataIndex: 'peopleCount',
                width: '5%',
            }, {
                title: 'Actions',
                width: '15%',
                render: (text, record) => {
                    const title = (record.video && record.video.title) || (record.playlist && record.playlist.title)
                    return <span>
                        <Popconfirm title={`是否删除 ${title} at ${record.promptAt}`} okText={'删除'} cancelText={'取消'}
                            onConfirm={() => {
                                handleDelete(record.id || record._id)
                            }}>
                            <Button type={'danger'} shape='circle'><DeleteFilled/></Button>
                        </Popconfirm>
                        &nbsp;
                        <Link to={'/prompts/' + (record.id || record._id)} target='prompt_edit'>
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
                onChange={handleTableChange}/>
        </div>
    )
}

ListWidget.propTypes = {
    pageSize: PropTypes.number,
    list: PropTypes.any,

    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
}

export default ListWidget
