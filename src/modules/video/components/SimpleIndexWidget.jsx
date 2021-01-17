import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Link, useLocation} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import {Col, Input, Row, Spin} from 'antd'

import {FETCH_VIDEOS} from '../graphql'
import SimpleListWidget from './SimpleListWidget'
import IsBannedInput from '../../blogger/components/IsBannedInput'

const { Search } = Input
export const DEFAULT_RESULT_SIZE = 1000

const SimpleIndexWidget = ({ multi, selectedRowKeys, onChange }) => {
    const [sResult, setResult] = useState([])
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_RESULT_SIZE })
    const [sSearchWords, setSearchWords] = useState()
    const [sConfirmed, setConfirmed] = useState(1)

    const location = useLocation()

    const { loading, error, data, refetch } = useQuery(FETCH_VIDEOS, {
        variables: { ...sFilter, searchWords: sSearchWords, onlyConfirmed: sConfirmed },
        credentials: 'include',
        skip: !multi && !sSearchWords
    })

    useEffect(() => {
        if (!location.state || !location.state.refresh || !refetch) {
            return
        }
        // console.log('refresh')
        refetch()
    }, [location, refetch])

    useEffect(() => {
        if (!data || !data.videos) {
            return
        }
        // console.log('init result', data)
        setResult(data.videos)
    }, [data])

    useEffect(() => {
        if (!error) {
            return
        }
        // history.push('/login')
        console.log(error)
    }, [error])

    const handleSearch = (value) => {
        setSearchWords(value)
    }

    const handleChange = (value) => {
        onChange && onChange(value)
    }

    const handleTableChange = (pagination) => {
        const offset = (pagination.current - 1) * pagination.pageSize
        setFilter({ offset, limit: DEFAULT_RESULT_SIZE })
    }

    const handleShowOnlyConfirmed = (value) => {
        console.log('handleShowOnlyConfirmed', value)
        setConfirmed(value)
    }

    return (
        <>
            <Row>
                <Col span={18} className='centerContainer'>
                    <Search placeholder='在 Title、Description、Tags、Keywords 中搜索' onSearch={handleSearch}
                        defaultValue={sSearchWords}/>
                </Col>
                <Col span={4} className='centerContainer'>
                    <Link to={'/videos/new'} target='video_edit'>新建视频</Link>
                </Col>
                <Col span={12} className='centerContainer'>
                    Only Cover Confirmed &nbsp; <IsBannedInput value={1} onChange={handleShowOnlyConfirmed}/>
                </Col>
            </Row>
            <Row>
                {loading && <Spin/>}
                {selectedRowKeys && (selectedRowKeys.length > 0) && (
                    <span style={{ color: 'red' }}>您已选择了 {selectedRowKeys.length} 条</span>)}
                {sResult && <SimpleListWidget list={sResult} onChange={handleChange} multi={multi}
                    onRefetch={handleTableChange} selectedRowKeys={selectedRowKeys}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

SimpleIndexWidget.propTypes = {
    selectedRowKeys: PropTypes.array,
    multi: PropTypes.bool,

    onChange: PropTypes.func,
}

export default SimpleIndexWidget
