import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Avatar, Button, Popconfirm, Table} from 'antd'
import {DeleteFilled, EditTwoTone} from '@ant-design/icons'

import {VISIBLE_STATUS} from '../../../components/StatusInput'
import IsBannedInput from '../../blogger/components/IsBannedInput'

export const DEFAULT_PAGE_SIZE = 10

const ListWidget = ({ list, pageSize, onDeleted, onEdit, onRefetch }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: 'Cover',
                width: '20%',
                render: (text, record) => {
                    return <div className='centerContainer'>
                        <img src={record.cover} alt={record.title} height={160}/>
                    </div>
                }
            }, {
                title: 'Title',
                dataIndex: 'title',
                width: '10%',
            }, {
                title: 'Tags/频道',
                dataIndex: 'tags',
                width: '10%',
            }, {
                title: 'Keywords',
                dataIndex: 'keywords',
                width: '10%',
            }, {
                title: 'Blogger',
                width: '5%',
                render: (text, record) => {
                    return <> {record.blogger && <>
                        <Avatar size='large' src={record.blogger.image} alt={record.blogger.name}/>
                        {record.blogger.name} </>} </>
                }
            }, {
                title: 'Videos Count',
                width: '5%',
                render: (text, record) => {
                    return <>{record.videos.length}</>
                }
            }, {
                title: 'Completed',
                width: '5%',
                render: (text, record) => {
                    return <IsBannedInput value={record.completed} disabled/>
                }
            }, {
                title: 'Visible',
                width: '5%',
                render: (text, record) => {
                    const currStatus = VISIBLE_STATUS.filter(v => v.value === record.status)[0]
                    return <span>{currStatus.label}</span>
                }
            }, {
                title: 'Actions',
                width: '15%',
                render: (text, record) => {
                    return <span>
                        <Popconfirm title={`是否删除 ${record.title}`} okText={'删除'} cancelText={'取消'}
                            onConfirm={() => {
                                handleDelete(record.id || record._id)
                            }}>
                            <Button type={'danger'} shape='circle'><DeleteFilled/></Button>
                        </Popconfirm> &nbsp;&nbsp;
                        <Link to={'/playlists/' + (record.id || record._id)} target='playlist_edit'>
                            <Button shape='circle'><EditTwoTone/></Button>
                        </Link>&nbsp;&nbsp;
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
    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
    pageSize: PropTypes.number,
    list: PropTypes.any,
}

export default ListWidget
