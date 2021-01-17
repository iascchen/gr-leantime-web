import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, Row, Select} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'
import moment from 'moment'

import {useUser} from '../../login/hook/UserProvider'
import {layout, loggerError, tailLayout} from '../../../components/constant'
import {CREATE_PROMPT_TASK, FETCH_PROMPT_TASK, UPDATE_PROMPT_TASK} from '../graphql'
import PrompterSelect from '../../prompter/components/PrompterSelect'
import VideoSelectWidget from '../../video/components/VideoSelectWidget'
import PlaylistSelectWidget from '../../playlist/components/PlaylistSelectWidget'

const { Option } = Select
const { TextArea } = Input

export const PROMPT_TOOLS = ['快客', '企业微信', '个人微信']
export const PROMPT_TYPES = ['群', '点对点']
export const PROMPT_OBJECTS = ['视频', '专辑']

const disabledDate = (current) => {
    // Can not select days after today and today
    return current && current > moment().endOf('day')
}

const range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
        result.push(i)
    }
    return result
}

const disabledDateTime = () => {
    return {
        disabledMinutes: () => range(1, 60),
        disabledSeconds: () => range(1, 60),
    }
}

const EditWidget = () => {
    const { user } = useUser()
    const [sAdminId, setAdminId] = useState()

    const [sRecord, setRecord] = useState({
        promptObject: PROMPT_OBJECTS[0], promptTool: PROMPT_TOOLS[0],
        promptType: PROMPT_TYPES[0]
    })
    const [sPromptObject, setPromptObject] = useState(PROMPT_OBJECTS[0])

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()

    const { error, data } = useQuery(FETCH_PROMPT_TASK, {
        variables: { id },
        skip: !id
    })
    const [createPromptTask] = useMutation(CREATE_PROMPT_TASK)
    const [updatePromptTask] = useMutation(UPDATE_PROMPT_TASK)

    useEffect(() => {
        if (!user) {
            return
        }
        setAdminId(user._id)
    }, [user])

    useEffect(() => {
        if (!sAdminId) {
            return
        }
        setRecord({ adminId: sAdminId })
    }, [sAdminId])

    useEffect(() => {
        if (!data || !data.promptTasks || !data.promptTasks.entities || !data.promptTasks.entities[0]) {
            return
        }
        console.log('init data', data)

        const _record = { ...data.promptTasks.entities[0] }
        _record.prompter = [_record.prompter]
        _record.promptAt = moment(_record.promptAt)

        _record.videoId = [_record.video,]
        _record.playlistId = [_record.playlist,]

        setRecord(_record)
        setPromptObject(_record.promptObject)
    }, [data])

    useEffect(() => {
        if (!sRecord) {
            return
        }
        // console.log('init sRecord', sRecord)
        formData.setFieldsValue(sRecord)
    }, [sRecord])

    useEffect(() => {
        if (!error) {
            return
        }
        console.log(error)
        // history.push('/login')
    }, [error])

    const handleSave = (values) => {
        console.log('handleSave', values)

        const _task = { ...values }
        const videoId = _task.videoId && _task.videoId[0].id
        const playlistId = _task.playlistId && _task.playlistId[0].id
        const title = (_task.videoId && _task.videoId[0].title) || (_task.playlistId && _task.playlistId[0].title)
        delete _task.videoId
        delete _task.playlistId

        const prompterId = _task.prompter[0].id
        const prompterName = _task.prompter[0].name
        delete _task.prompter
        const _taskAdjust = { videoId, playlistId, title, prompterId, prompterName, ..._task }

        console.log(_taskAdjust)

        // save
        const toPromptTasks = (result) => {
            // console.log(result)
            history.push('/myprompts', { refresh: true })
        }

        // console.log('handleSave', values)
        const _video = { ...values }
        console.log('handleSave', _video)

        if (id) {
            delete _taskAdjust.id
            delete _taskAdjust._id

            delete _taskAdjust.adminId
            delete _taskAdjust.promptObject
            delete _taskAdjust.videoId
            delete _taskAdjust.playlistId
            delete _taskAdjust.prompterId

            updatePromptTask({ variables: { id: id, promptTask: _taskAdjust }, }).then(
                toPromptTasks,
                loggerError)
        } else {
            createPromptTask({ variables: { promptTask: _taskAdjust } }).then(
                toPromptTasks,
                loggerError)
        }
    }

    const handlePrompterChange = (value) => {
        console.log('handlePrompterChange', value)
        formData.setFieldsValue({ prompterId: value[0].id })
    }

    const handlePromptObjectChange = (value) => {
        // console.log('handlePromptTypeChange', value)
        setPromptObject(value)
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/myprompts')
    }

    // const _formdata = formData && formData.getFieldsValue()
    return (
        <Card title='分发任务管理详情'>
            {/*{JSON.stringify(sRecord)}*/}
            <Form {...layout} form={formData} onFinish={handleSave}
                initialValues={sRecord}>
                <Row>
                    <Col span={11}>
                        <Divider>分发主体</Divider>
                        <Form.Item name='adminId' label='AdminID' required>
                            <Input disabled/>
                        </Form.Item>
                        <Form.Item name='prompter' label='Prompter' required>
                            <PrompterSelect onChange={handlePrompterChange} mine/>
                        </Form.Item>
                        <Form.Item name='promptObject' label='分发对象' required>
                            <Select onChange={handlePromptObjectChange} disabled={!!id}>
                                {PROMPT_OBJECTS.map((v) => {
                                    return <Option key={v} value={v}>{v}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        {sPromptObject === PROMPT_OBJECTS[1] ?
                            <Form.Item name='playlistId' label='Playlist' required>
                                <PlaylistSelectWidget disabled={!!id}/>
                            </Form.Item>
                            : <Form.Item name='videoId' label='Video' required>
                                <VideoSelectWidget disabled={!!id}/>
                            </Form.Item>}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={12}>
                        <Divider>分发详情</Divider>

                        <Form.Item name='promptAt' label='分发时段' required>
                            <DatePicker disabledDate={disabledDate} disabledTime={disabledDateTime} showNow={false}
                                showTime={{ defaultValue: moment('08:00:00', 'HH:mm:ss') }}/>
                        </Form.Item>

                        <Form.Item name='promptTool' label='分发工具' required>
                            <Select>
                                {PROMPT_TOOLS.map((v) => {
                                    return <Option key={v} value={v}>{v}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name='promptType' label='分发类型' required>
                            <Select>
                                {PROMPT_TYPES.map((v) => {
                                    return <Option key={v} value={v}>{v}</Option>
                                })}
                            </Select>
                        </Form.Item>
                        <Form.Item name='groupCount' label='覆盖群数'>
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item name='peopleCount' label='覆盖人数'>
                            <InputNumber/>
                        </Form.Item>
                        <Form.Item name='targetType' label='目标用户类型'>
                            <Input placeholder={'如：国画、北京等'}/>
                        </Form.Item>
                        <Form.Item name='desc' label='描述'>
                            <TextArea rows={4} placeholder={'记录一下分发目的、分发人群等信息'}/>
                        </Form.Item>
                        <Form.Item {...tailLayout} >
                            {!id &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}><SaveOutlined/> 取消
                            </Button>
                            }
                            <Button type='primary' htmlType='submit'
                                style={{ width: '30%', margin: '0 10%' }}><SaveOutlined/> 保存 </Button>
                        </Form.Item>
                        {/*<div>{JSON.stringify(_formdata)}</div>*/}
                        <div>{JSON.stringify(error)}</div>
                    </Col>
                </Row>
            </Form>
        </Card>
    )
}

export default EditWidget
