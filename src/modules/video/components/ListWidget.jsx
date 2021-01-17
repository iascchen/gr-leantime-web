import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link} from 'react-router-dom'
import {Avatar, Button, Popconfirm, Table, Tooltip} from 'antd'
import {
    BorderOutlined,
    CheckOutlined,
    DeleteFilled,
    DownloadOutlined,
    EditTwoTone,
    TagsTwoTone
} from '@ant-design/icons'

import {VISIBLE_STATUS} from '../../../components/StatusInput'
import IsBannedInput from '../../blogger/components/IsBannedInput'

export const DEFAULT_PAGE_SIZE = 10

const formatLabels = (labels) => {
    if (!labels) {
        return
    }

    return <>{
        labels.targets.map((v, index) => <p
            key={index}>{v.target} : {v.labelLevel1} ; {v.labelLevel2} ; {v.labelLevel3} ; {v.labelLevel4}</p>)
    }</>
}

const ListWidget = ({ list, pageSize, onDeleted, onEdit, onRefetch, onCoverConfirm }) => {
    const [sColumns, setColumns] = useState()

    useEffect(() => {
        const _columns = [
            {
                title: 'Cover',
                width: '20%',
                render: (text, record) => {
                    return <div className='centerContainer'>
                        <img src={record.cover_path} alt={record.title} height={160}/>
                    </div>
                }
            }, {
                title: () => <CheckOutlined/>,
                width: '2%',
                render: (text, record) => {
                    // const currStatus = CONFIRM_STATUS.filter(v => v.value === record.coverConfirm)[0]
                    return <div>
                        <IsBannedInput value={record.coverConfirm} disabled/>
                        <br/>
                        <Tooltip title='改变封面确认'>
                            <Button shape='circle' onClick={() => {
                                handleCoverConfirm(record.id || record._id, record.coverConfirm ? 0 : 1)
                                record.coverConfirm = record.coverConfirm ? 0 : 1
                            }}>{record.coverConfirm ? <BorderOutlined/> : <CheckOutlined/>}
                            </Button>
                        </Tooltip>
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
                title: 'Labels',
                width: '15%',
                render: (text, record) => {
                    return <>{formatLabels(record.labels)}</>
                }
            }, {
                title: 'Blogger',
                width: '5%',
                render: (text, record) => {
                    return <> {record.blogger && <>
                        <Avatar size='large' src={record.blogger.image} alt={record.blogger.name}/>
                        {record.blogger.name} </>} </>
                }
            }, {
                title: 'Seconds',
                width: '5%',
                dataIndex: 'seconds'
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
                        <Link to={'/videos/' + (record.id || record._id)} target='video_edit'>
                            <Button shape='circle'><EditTwoTone/></Button>
                        </Link>
                        <Link to={'/videos/' + (record.id || record._id) + '?label'} target='video_edit'>
                            <Button shape='circle'><TagsTwoTone/></Button>
                        </Link> &nbsp;&nbsp;
                        <a href={record.play_location} target='_blank' rel='noreferrer noopener' download>
                            <Button shape='circle'><DownloadOutlined/></Button>
                        </a>
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

    const handleCoverConfirm = (id, value) => {
        if (onCoverConfirm) {
            onCoverConfirm(id, value)
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
    pageSize: PropTypes.number,
    list: PropTypes.any,

    onDeleted: PropTypes.func,
    onEdit: PropTypes.func,
    onRefetch: PropTypes.func,
    onCoverConfirm: PropTypes.func,
}

export default ListWidget
