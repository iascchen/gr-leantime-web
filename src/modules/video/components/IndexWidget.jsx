import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {Button, Col, Input, Row, Spin} from 'antd'
import {PlusOutlined} from '@ant-design/icons'

import {loggerError} from '../../../components/constant'
import ListWidget, {DEFAULT_PAGE_SIZE} from './ListWidget'
import {DEL_VIDEO, FETCH_VIDEOS, UPDATE_VIDEO} from '../graphql'
import IsBannedInput from '../../blogger/components/IsBannedInput'

const { Search } = Input

const IndexWidget = () => {
    const [sResult, setResult] = useState([])
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    const [sUnconfirmed, setUnconfirmed] = useState(0)
    const [sPageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [sSearchWords, setSearchWords] = useState()

    const history = useHistory()
    const location = useLocation()

    const { loading, error, data, refetch } = useQuery(FETCH_VIDEOS, {
        variables: { ...sFilter, searchWords: sSearchWords, onlyUnconfirmed: sUnconfirmed },
        credentials: 'include',
    })
    const [delVideo] = useMutation(DEL_VIDEO)
    const [updateVideo] = useMutation(UPDATE_VIDEO)

    useEffect(() => {
        if (!location.state || !location.state.refresh || !refetch) {
            return
        }
        console.log('refresh')
        refetch()
    }, [location, refetch])

    useEffect(() => {
        if (!data || !data.videos) {
            return
        }
        console.log('init result', data)
        setResult(data.videos)
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

    const handleShowOnlyUnconfirmed = (value) => {
        console.log('handleShowOnlyUnconfirmed', value)
        setUnconfirmed(value)
    }

    const handleCreate = () => {
        history.push('/videos/new')
    }

    const handleEdit = (id) => {
        history.push(`/videos/${id}`)
    }

    const handleDeleted = (id) => {
        // console.log('handleDeleted', id)
        delVideo({ variables: { id }, }).then(
            () => refetch(),
            loggerError)
    }

    const handleRefetch = (pagination) => {
        // console.log('handleRefetch', pagination)
        setPageSize(pagination.pageSize)
        const offset = (pagination.current - 1) * pagination.pageSize
        setFilter({ offset, limit: pagination.pageSize })
    }

    const handleCoverConfirm = (id, value) => {
        // console.log('handleCoverConfirm', id, value)
        const toVideos = (result) => {
            history.push('/videos', { refresh: true })
        }

        const _video = { coverConfirm: value }
        updateVideo({ variables: { id: id, video: _video } }).then(
            toVideos,
            loggerError)
    }

    return (
        <>
            <Row>
                <Col span={4}>
                    <h2>视频内容</h2>
                </Col>
                <Col span={6} className='centerContainer'>
                    <Search placeholder='在 Title、Description、Tags、Keywords 中搜索' onSearch={handleSearch}
                        defaultValue={sSearchWords}/>
                </Col>
                <Col span={2} className='centerContainer'>
                </Col>
                <Col span={6} className='centerContainer'>
                    Only Cover Unconfirmed &nbsp; <IsBannedInput value={0} onChange={handleShowOnlyUnconfirmed}/>
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
                    onCoverConfirm={handleCoverConfirm} pageSize={sPageSize}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

export default IndexWidget
