import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {Button, Col, Input, Row, Spin} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import ListWidget, {DEFAULT_PAGE_SIZE} from './ListWidget'
import {DEL_LABEL, FETCH_LABELS} from '../graphql'

const { Search } = Input

const IndexWidget = () => {
    const [sResult, setResult] = useState([])
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    const [sPageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [sKeywords, setKeywords] = useState()

    const history = useHistory()
    const location = useLocation()

    const { loading, error, data, refetch } = useQuery(FETCH_LABELS, {
        variables: { ...sFilter, keywords: sKeywords },
        credentials: 'include'
    })
    const [delLeveledLabel] = useMutation(DEL_LABEL)

    useEffect(() => {
        if (!location.state || !location.state.refresh || !refetch) {
            return
        }
        console.log('refresh')
        refetch()
    }, [location, refetch])

    useEffect(() => {
        if (!data || !data.labels) {
            return
        }
        console.log('init result', data)
        setResult(data.labels)
    }, [data])

    useEffect(() => {
        if (!error) {
            return
        }
        history.push('/login')
    }, [error])

    const handleSearch = (value) => {
        setKeywords(value)
    }

    const handleCreate = () => {
        history.push('/labels/new')
    }

    const handleEdit = (id) => {
        history.push(`/labels/${id}`)
    }

    const handleCreateSub = (id) => {
        history.push(`/labels/${id}/new`)
    }

    const handleDeleted = (id) => {
        // console.log('handleDeleted', id)
        delLeveledLabel({ variables: { id }, }).then(
            () => refetch(),
            (err) => {
                // ignore error
                refetch()
            })
    }

    const handleRefetch = (pagination) => {
        // console.log('handleRefetch', pagination)
        setPageSize(pagination.pageSize)
        const offset = (pagination.current - 1) * pagination.pageSize
        setFilter({ offset, limit: pagination.pageSize })
    }

    return (
        <>
            <Row>
                <Col span={4}>
                    <h2>分级标签管理</h2>
                </Col>
                <Col span={6} className='centerContainer'>
                    <Search placeholder='在 Name 中搜索' onSearch={handleSearch} defaultValue={sKeywords}/>
                </Col>
                <Col span={11}>
                    {/*{JSON.stringify(accessToken)}*/}
                </Col>
                <Col span={2} className='centerContainer'>
                    <Button type='primary' shape='circle' onClick={handleCreate}><PlusOutlined/></Button>
                </Col>
            </Row>
            <Row>
                {loading && <Spin/>}
                {sResult && <ListWidget list={sResult} onDeleted={handleDeleted} onEdit={handleEdit}
                    onCreateSub={handleCreateSub} onRefetch={handleRefetch} pageSize={sPageSize}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

export default IndexWidget
