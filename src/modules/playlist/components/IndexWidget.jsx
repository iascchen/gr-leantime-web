import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {Button, Col, Input, Row, Spin} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import {loggerError} from '../../../components/constant'
import ListWidget, {DEFAULT_PAGE_SIZE} from './ListWidget'
import {DEL_PLAYLIST, FETCH_PLAYLISTS} from '../graphql'
import IsBannedInput from '../../blogger/components/IsBannedInput'

const { Search } = Input

const IndexWidget = () => {
    const [sResult, setResult] = useState([])
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    const [sOnlyUncompleted, setOnlyUncompleted] = useState(0)
    const [sPageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [sSearchWords, setSearchWords] = useState()

    const history = useHistory()

    const { loading, error, data, refetch } = useQuery(FETCH_PLAYLISTS, {
        variables: { ...sFilter, searchWords: sSearchWords, onlyUncompleted: sOnlyUncompleted },
        credentials: 'include',
    })
    const [delPlaylist] = useMutation(DEL_PLAYLIST)

    useEffect(() => {
        if (!data || !data.playlists) {
            return
        }
        console.log('init result', data)
        setResult(data.playlists)
    }, [data])

    useEffect(() => {
        if (!error) {
            return
        }
        history.push('/login')
    }, [error])

    const handleSearch = (value) => {
        setSearchWords(value)
    }

    const handleShowOnlyUncompleted = (value) => {
        console.log('handleShowOnlyUncompleted', value)
        setOnlyUncompleted(value)
    }

    const handleCreate = () => {
        history.push('/playlists/new')
    }

    const handleEdit = (id) => {
        history.push(`/playlists/${id}`)
    }

    const handleDeleted = (id) => {
        // console.log('handleDeleted', id)
        delPlaylist({ variables: { id }, }).then(
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
                    <h2>视频专辑</h2>
                </Col>
                <Col span={6} className='centerContainer'>
                    <Search placeholder='在 Title、Description、Tags、Keywords 中搜索' onSearch={handleSearch}
                        defaultValue={sSearchWords}/>
                </Col>
                <Col span={2} className='centerContainer'>
                </Col>
                <Col span={6} className='centerContainer'>
                    Only Uncompleted &nbsp; <IsBannedInput value={0} onChange={handleShowOnlyUncompleted}/>
                </Col>
                <Col span={2}>
                    {/*{JSON.stringify(accessToken)}*/}
                </Col>
                <Col span={2} className='centerContainer'>
                    <Button type='primary' shape='circle' onClick={handleCreate}><PlusOutlined/></Button>
                </Col>
            </Row>
            <Row>
                {loading && <Spin/>}
                {sResult &&
                <ListWidget list={sResult} onDeleted={handleDeleted} onEdit={handleEdit} onRefetch={handleRefetch}
                    pageSize={sPageSize}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

export default IndexWidget
