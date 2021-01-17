import React, {useEffect, useState} from 'react'
import {Button, Popconfirm, Table} from 'antd'
import {
    DeleteFilled,
    EditTwoTone,
    FileImageOutlined,
    PlusOutlined,
    TagsTwoTone,
    VideoCameraOutlined
} from '@ant-design/icons'

import IsBannedInput from '../../blogger/components/IsBannedInput'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'

export const DEFAULT_PAGE_SIZE = 10

const formatLabels = (labels) => {
    if (!labels) {
        return
    }

    return <p>{labels.labelLevel1} ; {labels.labelLevel2} ; {labels.labelLevel3}</p>
}

const ListWidget = ({ list, pageSize, onDeleted, onEdit, onRefetch, onCreateSub }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: 'Name',
                dataIndex: 'label_name',
                width: '20%',
            }, {
                title: 'Order',
                dataIndex: 'label_order',
                width: '5%',
            }, {
                title: 'English',
                dataIndex: 'english',
                width: '10%',
            }, {
                title: 'Labels',
                width: '20%',
                render: (text, record) => {
                    return <>{formatLabels(record.labels)}</>
                }
            }, {
                title: 'Type',
                width: '5%',
                render: (text, record) => {
                    return <span>{record.type === 'video' ? <VideoCameraOutlined/> : <FileImageOutlined/>}</span>
                }
            }, {
                title: 'Show',
                width: '5%',
                render: (text, record) => {
                    return <IsBannedInput value={record.is_show} disabled/>
                }
            }, {
                title: 'Actions',
                width: '20%',
                render: (text, record) => {
                    return <span>
                        {(record.children && record.children.length === 0) &&
                        <Popconfirm title={`是否删除 ${record.label_name}`} okText={'删除'} cancelText={'取消'}
                            onConfirm={() => {
                                handleDelete(record.id || record._id)
                            }}>
                            <Button type={'danger'} shape='circle'><DeleteFilled/></Button>
                        </Popconfirm>
                        }
                        &nbsp;&nbsp;
                        <Link to={'/weapptabs/' + (record.id || record._id)} target='weapptab_edit'>
                            <Button shape='circle'><EditTwoTone/></Button>
                        </Link>
                        <Link to={'/weapptabs/' + (record.id || record._id) + '?tag'} target='video_edit'>
                            <Button shape='circle'><TagsTwoTone/></Button>
                        </Link>
                        &nbsp;&nbsp;
                        {!record.parentid &&
                        <Button shape='circle' onClick={() => handleCreateSub(record.id || record._id)}><PlusOutlined/></Button>
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
            {/*{JSON.stringify(list)}*/}
        </div>
    )
}

ListWidget.propTypes = {
    list: PropTypes.any,
    pageSize: PropTypes.number,

    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
    onCreateSub: PropTypes.func,
}

export default ListWidget
