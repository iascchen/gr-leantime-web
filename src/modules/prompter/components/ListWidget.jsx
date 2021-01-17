import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Avatar, Button, Popconfirm, Table} from 'antd'
import {DeleteFilled, EditTwoTone} from '@ant-design/icons'

export const DEFAULT_PAGE_SIZE = 10

const ListWidget = ({ list, onDeleted, onEdit, pageSize, onRefetch }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: 'Image',
                width: '10%',
                render: (text, record) => {
                    return <Avatar size='large' src={record.image} alt={record.name}/>
                }
            }, {
                title: '微信名',
                dataIndex: 'name',
                width: '10%',
            }, {
                title: 'Tags',
                dataIndex: 'tags',
                width: '20%',
            }, {
                title: 'Actions',
                width: '10%',
                render: (text, record) => {
                    return <span>
                        <Popconfirm title={`是否删除 ${record.name}`} okText={'删除'} cancelText={'取消'}
                            onConfirm={() => {
                                handleDelete(record.id || record._id)
                            }}>
                            <Button type={'danger'} shape='circle'><DeleteFilled/></Button>
                        </Popconfirm>
                        &nbsp;
                        <Link to={'/prompters/' + (record.id || record._id)} target='prompter_edit'>
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
    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
    pageSize: PropTypes.number,
    list: PropTypes.any,
}

export default ListWidget
