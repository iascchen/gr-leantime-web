import React, {useEffect, useState} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {Button, Col, DatePicker, Input, Row, Spin} from 'antd'
import {PlusOutlined} from '@ant-design/icons'
import moment from 'moment'

import {loggerError} from '../../../components/constant'
import ListWidget, {DEFAULT_PAGE_SIZE} from './ListWidget'
import {DEL_PROMPT_TASK, FETCH_PROMPT_TASKS} from '../graphql'

const { Search } = Input
const { RangePicker } = DatePicker

const IndexWidget = () => {
    const [sResult, setResult] = useState([])
    const [sFilter, setFilter] = useState({ offset: 0, limit: DEFAULT_PAGE_SIZE })
    const [sPageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
    const [sKeywords, setKeywords] = useState()
    const [sDateRange, setDateRange] = useState([])

    const history = useHistory()
    const location = useLocation()

    const { loading, error, data, refetch } = useQuery(FETCH_PROMPT_TASKS, {
        variables: { ...sFilter, keywords: sKeywords, dateRange: sDateRange },
        credentials: 'include',
    })
    const [delPromptTask] = useMutation(DEL_PROMPT_TASK)

    useEffect(() => {
        if (!location.state || !location.state.refresh || !refetch) {
            return
        }
        console.log('refresh')
        refetch()
    }, [location, refetch])

    useEffect(() => {
        if (!data || !data.promptTasks) {
            return
        }
        console.log('init result', data)
        setResult(data.promptTasks)
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

    const handleCalendarChange = (value) => {
        console.log('handleCalendarChange', value)
        if (value && value.length > 1) {
            const [start, end] = value
            setDateRange([moment(start).startOf('day'), moment(end).endOf('day')])
        } else {
            setDateRange([])
        }
    }

    const handleCreate = () => {
        history.push('/prompts/new')
    }

    const handleEdit = (id) => {
        history.push(`/prompts/${id}`)
    }

    const handleDeleted = (id) => {
        // console.log('handleDeleted', id)
        delPromptTask({ variables: { id }, }).then(
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
                    <h2>我的分发记录</h2>
                </Col>
                <Col span={6} className='centerContainer'>
                    <Search placeholder='在 Title，Prompter，TargetType，Desc 中搜索' onSearch={handleSearch}
                        defaultValue={sKeywords}/>
                </Col>
                <Col span={2} className='centerContainer'>
                </Col>
                <Col span={6} className='centerContainer'>
                    Date &nbsp; <RangePicker onChange={handleCalendarChange}/>
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
                {sResult && <ListWidget list={sResult} onDeleted={handleDeleted} onEdit={handleEdit}
                    onRefetch={handleRefetch} pageSize={sPageSize}/>}
                {JSON.stringify(error)}
            </Row>
        </>
    )
}

export default IndexWidget
