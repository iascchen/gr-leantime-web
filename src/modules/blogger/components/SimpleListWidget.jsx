import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Avatar, Table} from 'antd'

export const DEFAULT_PAGE_SIZE = 20

const SimpleListWidget = ({ list, selectedRowKeys, pageSize, multi, onChange, onRefetch }) => {
    const [sColumns, setColumns] = useState()
    const [sType, setType] = useState()

    useEffect(() => {
        if (multi) {
            setType('checkbox')
        } else {
            setType('radio')
        }
    }, [multi])

    useEffect(() => {
        const _columns = [
            {
                title: 'ID',
                dataIndex: 'id',
                width: '10%',
                render: (text, record) => {
                    return <span style={{ color: 'red' }}>{record.id}</span>
                }
            }, {
                title: 'Image',
                width: '20%',
                render: (text, record) => {
                    return <Avatar size='large' src={record.image} alt={record.name}/>
                }
            }, {
                title: 'Name',
                dataIndex: 'name',
                width: '20%',
            }, {
                title: 'Location',
                width: '50%',
                render: (text, record) => {
                    return <div className='centerContainer'>{record.province},{record.city}</div>
                }
            }]
        setColumns(_columns)
    }, [])

    const handleTableChange = (pagination) => {
        onRefetch && onRefetch(pagination)
    }

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            onChange && onChange(selectedRows)
        }
    }

    return (
        <div className='centerContainer' style={{ width: '100%' }}>
            <Table columns={sColumns} dataSource={list.entities || []} style={{ width: '100%' }} rowKey='id'
                pagination={{ pageSize: pageSize || DEFAULT_PAGE_SIZE, total: list.total, showSizeChanger: false }}
                onChange={handleTableChange} rowSelection={{ type: sType, ...rowSelection, selectedRowKeys }}/>
        </div>
    )
}

SimpleListWidget.propTypes = {
    list: PropTypes.any,
    selectedRowKeys: PropTypes.array,
    pageSize: PropTypes.number,
    multi: PropTypes.bool,

    onChange: PropTypes.func,
    onRefetch: PropTypes.func,
}

export default SimpleListWidget
