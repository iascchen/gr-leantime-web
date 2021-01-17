import React, {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import {Col, Input, Row, Spin} from 'antd'

import SimpleListWidget from './SimpleListWidget'
import {FETCH_SIMPLE_BLOGGERS} from '../graphql'
import PropTypes from 'prop-types'

const { Search } = Input
export const DEFAULT_RESULT_SIZE = 1000

const SimpleIndexWidget = ({ selectedRowKeys, keyword, multi, mine, onChange, onKeywordChange }) => {
    const [sResult, setResult] = useState([])
    const [sKeywords, setKeywords] = useState(keyword)
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_RESULT_SIZE })

    const location = useLocation()

    const { loading, error, data, refetch } = useQuery(FETCH_SIMPLE_BLOGGERS, {
        variables: { ...sFilter, keywords: sKeywords, isMine: mine ? 1 : 0 },
        credentials: 'include',
        skip: !multi && !sKeywords && !mine
    })

    useEffect(() => {
        if (!location.state || !location.state.refresh || !refetch) {
            return
        }
        // console.log('refresh')
        refetch()
    }, [location, refetch])

    useEffect(() => {
        if (!keyword) {
            return
        }
        // console.log('refresh')
        setKeywords(keyword)
    }, [keyword])

    useEffect(() => {
        if (!data || !data.bloggers) {
            return
        }
        // console.log('init result', data)
        setResult(data.bloggers)
    }, [data])

    useEffect(() => {
        if (!error) {
            return
        }
        // history.push('/login')
        console.log(error)
    }, [error])

    const handleSearch = (value) => {
        setKeywords(value)
        onKeywordChange && onKeywordChange(value)
    }

    const handleChange = (value) => {
        onChange && onChange(value)
    }

    const handleTableChange = (pagination) => {
        const offset = (pagination.current - 1) * pagination.pageSize
        setFilter({ offset, limit: DEFAULT_RESULT_SIZE })
    }

    return (
        <>
            <Row>
                <Col span={18} className='centerContainer'>
                    <Search placeholder='在 Name,Tags 中搜索' onSearch={handleSearch} defaultValue={sKeywords}/>
                </Col>
                <Col span={4} className='centerContainer'>
                    <Link to={'/bloggers/new'} target='blogger_edit'>新建博主</Link>
                </Col>
            </Row>
            <Row>
                {loading && <Spin/>}
                {selectedRowKeys && (selectedRowKeys.length > 0) && (
                    <span style={{ color: 'red' }}>您已选择了 {selectedRowKeys.length} 位</span>)}
                {sResult && <SimpleListWidget list={sResult} onChange={handleChange} multi={multi}
                    onRefetch={handleTableChange} selectedRowKeys={selectedRowKeys}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

SimpleIndexWidget.propTypes = {
    keyword: PropTypes.string,
    selectedRowKeys: PropTypes.array,
    mine: PropTypes.bool,
    multi: PropTypes.bool,

    onChange: PropTypes.func,
    onKeywordChange: PropTypes.func,
}

export default SimpleIndexWidget
