import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Button, Col, Divider, Form, Input, Row} from 'antd'
import {SaveOutlined, SnippetsOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'
import queryString from 'query-string'

import {layout, loggerError, normalLayout} from '../../../components/constant'
import OssImageUpload from '../../../components/OssImageUpload'
import StatusInput from '../../../components/StatusInput'
import BloggerSelect from '../../blogger/components/BloggerSelect'
import {CREATE_PLAYLIST, FETCH_PLAYLIST, UPDATE_PLAYLIST} from '../graphql'
import IsBannedInput from '../../blogger/components/IsBannedInput'
import VideoSelectWidget from '../../video/components/VideoSelectWidget'

const { TextArea } = Input

const EditWidget = () => {
    const location = useLocation()

    const [sRecord, setRecord] = useState({ status: 1 })
    const [sVideoList, setVideoList] = useState([])
    const [sVideoIds, setVideoIds] = useState([])

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()

    const { error, data } = useQuery(FETCH_PLAYLIST, {
        variables: { id },
        skip: !id
    })

    const [createPlaylist] = useMutation(CREATE_PLAYLIST)
    const [updatePlaylist] = useMutation(UPDATE_PLAYLIST)

    useEffect(() => {
        if (!location) {
            return
        }
        // console.log('init location', location)

        const search = location.search
        if (location.pathname.includes('/new') && search) {
            // console.log('init location search', search)
            const _record = queryString.parse(search)
            // console.log('_record', _record)
            _record.blogger = JSON.parse(_record.blogger)
            console.log('_record', _record)
            setRecord(_record)
        }
    }, [location])

    useEffect(() => {
        if (!data || !data.playlists || !data.playlists.entities || !data.playlists.entities[0]) {
            return
        }
        console.log('init data', data)
        const _record = data.playlists.entities[0]
        setRecord(_record)
    }, [data])

    useEffect(() => {
        if (!error) {
            return
        }
        history.push('/login')
    }, [error])

    useEffect(() => {
        if (!sRecord) {
            return
        }

        formData.setFieldsValue(sRecord)
        if (sRecord.blogger) {
            const bloggers = [sRecord.blogger]
            formData.setFieldsValue({ blogger: bloggers })
        }

        if (sRecord.videos) {
            setVideoList(sRecord.videos)
        }

        if (sRecord.videoIds) {
            setVideoIds(sRecord.videoIds.split(','))
            formData.setFieldsValue({ videoIds: sRecord.videoIds.split(',') })
        }

    }, [sRecord])

    const handleSave = () => {
        const values = formData.getFieldsValue()
        // console.log('handleSave', values)

        // save
        const toPlaylists = (result) => {
            // console.log(result)
            history.push('/playlists', { refresh: true })
        }

        processSave(values, toPlaylists)
    }

    const handleSaveAndCreate = () => {
        const values = formData.getFieldsValue()
        // console.log('handleSaveAndCreate', values)

        const title = values.title + '_new'
        const _playlist = {
            title, tags: values.tags, desc: values.desc, keywords: values.keywords,
            blogger: JSON.stringify(values.blogger[0])
        }
        const _playlistStr = `/playlists/new?${queryString.stringify(_playlist)}`

        // save
        const toPlaylistNew = (result) => {
            // console.log(result)
            history.push(_playlistStr, { refresh: true, })
        }

        processSave(values, toPlaylistNew)
    }

    const processSave = (values, toNext) => {
        const _playlist = { ...values }
        console.log('processSave', _playlist)

        if (values.blogger) {
            _playlist.bloggerId = values.blogger[0].id
        }
        delete _playlist.blogger

        if (sVideoList) {
            _playlist.videoIds = sVideoList.map(v => v.id).join(',')
        }
        delete _playlist.videos

        if (id) {
            delete _playlist.id
            delete _playlist._id
            updatePlaylist({ variables: { id: id, playlist: _playlist }, }).then(
                toNext,
                loggerError)
        } else {
            delete _playlist.status
            createPlaylist({ variables: { playlist: _playlist } }).then(
                toNext,
                loggerError)
        }
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/playlists')
    }

    const handleBloggerChange = (value) => {
        console.log('handleBloggerChange', value)
        formData.setFieldsValue({ bloggerId: value[0].id })
    }

    const handleVideoChange = (value) => {
        console.log('handleVideoChange', value)
        setVideoList(value)
        // formData.setFieldsValue({ bloggerId: value[0].id })
        // formData.setFieldsValue({ videos: value })
    }

    return (
        <>
            {/*{JSON.stringify(sRecord)}*/}
            <Form {...layout} form={formData} onFinish={handleSave} initialValues={sRecord}>
                <Row>
                    <Col span={11}>
                        <Divider>基本信息</Divider>
                        <Form.Item name='cover' label='Cover(OSS)' required>
                            <OssImageUpload/>
                        </Form.Item>

                        <Form.Item name='title' label='Title' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='desc' label='Description'>
                            <TextArea rows={4}/>
                        </Form.Item>

                        <Form.Item name='completed' label='Completed'>
                            <IsBannedInput/>
                        </Form.Item>
                        <Form.Item name='continuePoster' label='ContinuePoster(OSS)'>
                            <OssImageUpload/>
                        </Form.Item>

                        <Divider>发布管理</Divider>
                        <Form.Item name='tags' label='Tags/频道' required>
                            <Input placeholder={'多个 tag 使用英文逗号 , 分割'}/>
                        </Form.Item>
                        <Form.Item name='keywords' label='Keywords'>
                            <Input placeholder={'多个 keyword 使用英文逗号 , 分割'}/>
                        </Form.Item>
                        <Form.Item name='blogger' label='Blogger'>
                            <BloggerSelect onChange={handleBloggerChange} mine/>
                        </Form.Item>
                        <Form.Item name='status' label='Status'>
                            <StatusInput disabled={!id}/>
                        </Form.Item>
                    </Col>
                    <Col span={1}>
                    </Col>
                    <Col span={11}>
                        <Divider>视频列表</Divider>
                        <VideoSelectWidget type={'formlist'} multi onChange={handleVideoChange}
                            value={sVideoList} selectedKeys={sVideoIds}/>

                        <Form.Item {...normalLayout} >
                            {!id &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}> 取消 </Button>
                            }
                            <Button type='primary' htmlType='submit' style={{ width: '30%', margin: '0 10%' }}>
                                <SaveOutlined/> 保存 </Button>
                            {!!id &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleSaveAndCreate}>
                                <SnippetsOutlined/> 保存 & 新建 </Button>
                            }
                        </Form.Item>
                        <Form.Item {...normalLayout} >
                            {!id &&
                            <Button style={{ width: '50%', margin: '0 25%' }} onClick={handleSaveAndCreate}>
                                <SnippetsOutlined/> 保存 & 新建 </Button>
                            }
                        </Form.Item>
                        <div>{JSON.stringify(error)}</div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default EditWidget
