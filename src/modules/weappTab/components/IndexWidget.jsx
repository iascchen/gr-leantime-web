import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {Button, Col, Input, Row, Spin} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import {loggerError} from '../../../components/constant'
import ListWidget, {DEFAULT_PAGE_SIZE} from './ListWidget'
import {DEL_WEAPPTAB, FETCH_WEAPPTABS} from '../graphql'

const { Search } = Input

const IndexWidget = () => {
    const [sResult, setResult] = useState([])
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    const [sPageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [sKeywords, setKeywords] = useState()

    const history = useHistory()

    const { loading, error, data, refetch } = useQuery(FETCH_WEAPPTABS, {
        variables: { ...sFilter, keywords: sKeywords },
        credentials: 'include',
    })
    const [delEntity] = useMutation(DEL_WEAPPTAB)

    useEffect(() => {
        if (!refetch) {
            return
        }
        console.log('refresh')
        refetch()
    }, [refetch])

    useEffect(() => {
        if (!data || !data.weappTabs) {
            return
        }
        console.log('init result', data)
        setResult(data.weappTabs)
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
        history.push('/weapptabs/new')
    }

    const handleCreateSub = (id) => {
        history.push(`/weapptabs/${id}/new`)
    }

    const handleEdit = (id) => {
        history.push(`/weapptabs/${id}`)
    }

    const handleDeleted = (id) => {
        // console.log('handleDeleted', id)
        delEntity({ variables: { id }, }).then(
            () => refetch(),
            loggerError)
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
                    <h2>小程序频道配置</h2>
                </Col>
                <Col span={6} className='centerContainer'>
                    <Search placeholder='在 Name 和 English 中搜索' onSearch={handleSearch} defaultValue={sKeywords}/>
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
                    onRefetch={handleRefetch} onCreateSub={handleCreateSub} pageSize={sPageSize}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

export default IndexWidget
