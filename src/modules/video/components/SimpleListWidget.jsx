import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Avatar, Table} from 'antd'
import {CheckOutlined} from '@ant-design/icons'
import IsBannedInput from '../../blogger/components/IsBannedInput'

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
                title: 'Cover',
                width: '25%',
                render: (text, record) => {
                    return <div className='centerContainer'>
                        <img src={record.cover_path} alt={record.title} height={80}/>
                    </div>
                }
            }, {
                title: () => <CheckOutlined/>,
                width: '5%',
                render: (text, record) => {
                    return <IsBannedInput value={record.coverConfirm} disabled/>
                }
            }, {
                title: 'Title',
                dataIndex: 'title',
                width: '30%',
            }, {
                title: 'Blogger',
                width: '30%',
                render: (text, record) => {
                    return <> {record.blogger && <>
                        <Avatar size='large' src={record.blogger.image} alt={record.blogger.name}/>
                        {record.blogger.name} </>} </>
                }
            },
        ]
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
