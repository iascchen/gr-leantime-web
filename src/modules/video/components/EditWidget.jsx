import React, {useEffect, useState} from 'react'
import {useHistory, useLocation, useParams} from 'react-router-dom'
import {Button, Col, Divider, Form, Input, InputNumber, message, Popconfirm, Row} from 'antd'
import {CopyOutlined, SaveOutlined, SnippetsOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import queryString from 'query-string'

import {layout, loggerError, tailLayout} from '../../../components/constant'
import OssImageUpload from '../../../components/OssImageUpload'
import StatusInput from '../../../components/StatusInput'
import OssVodUpload from './OssVodUpload'
import BloggerSelect from '../../blogger/components/BloggerSelect'
import {CREATE_VIDEO, FETCH_VIDEO, FETCH_VIDEO_INFO, UPDATE_VIDEO} from '../graphql'
import IsBannedInput from '../../blogger/components/IsBannedInput'

const { TextArea, Group } = Input

const EditWidget = () => {
    const location = useLocation()

    const [sRecord, setRecord] = useState({ status: 1 })
    const [sVideoId, setVideoId] = useState()
    const [sPlayUrl, setPlayUrl] = useState()

    const [sPopVisible, setPopVisible] = useState(false)
    const [sAliyunVideoInfo, setAliyunVideoInfo] = useState()

    const [sMetaPopVisible, setMetaPopVisible] = useState(false)

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()

    const { error, data } = useQuery(FETCH_VIDEO, {
        variables: { id },
        skip: !id
    })

    const { error: errorVideoInfo, data: dataVideoInfo, refetch: refetchVideoInfo } = useQuery(FETCH_VIDEO_INFO, {
        variables: { VideoId: sVideoId },
        skip: !sVideoId,
    })

    const [createVideo] = useMutation(CREATE_VIDEO)
    const [updateVideo] = useMutation(UPDATE_VIDEO)

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
        if (!data || !data.videos || !data.videos.entities || !data.videos.entities[0]) {
            return
        }
        console.log('init data', data)
        const _record = data.videos.entities[0]
        setRecord(_record)
        setVideoId(_record.videoId)
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
    }, [sRecord])

    useEffect(() => {
        if (!sVideoId) {
            return
        }
        refetchVideoInfo()
    }, [sVideoId])

    useEffect(() => {
        if (!dataVideoInfo || !dataVideoInfo.vodGetPlayInfo
            || !dataVideoInfo.vodGetPlayInfo.PlayInfo || !dataVideoInfo.vodGetPlayInfo.VideoBase) {
            return
        }
        // console.log('dataVideoInfo.vodGetPlayInfo', dataVideoInfo.vodGetPlayInfo)

        const { PlayURL, Width, Height, Duration } = dataVideoInfo.vodGetPlayInfo.PlayInfo
        // const { CoverURL, Title } = dataVideoInfo.vodGetPlayInfo.VideoBase

        // console.log(PlayURL, sRecord.play_location)
        const metaFromVod = {
            seconds: Math.round(Duration),
            width: Width,
            height: Height,
            play_location: PlayURL,
        }
        // console.log('metaFromVod', metaFromVod)
        formData.setFieldsValue(metaFromVod)

        setPlayUrl(PlayURL)

        // // console.log(sRecord.play_location)
        // if (CoverURL !== sRecord.cover_path || Title !== sRecord.title) {
        //     // console.log(CoverURL, sRecord.cover_path)
        //     // console.log(Title, sRecord.title)
        //
        //     const updatedFromVod = {
        //         title: Title,
        //         cover_path: CoverURL,
        //         play_location: PlayURL,
        //     }
        //     setAliyunVideoInfo(updatedFromVod)
        //     setPopVisible(true)
        // }
    }, [dataVideoInfo])

    const handleSave = () => {
        const values = formData.getFieldsValue()
        // console.log('handleSave', values)

        // save
        const toVideos = (result) => {
            // console.log(result)
            history.push('/videos', { refresh: true })
        }

        processSave(values, toVideos)
    }

    const handleSaveAndCreate = () => {
        const values = formData.getFieldsValue()
        // console.log('handleSaveAndCreate', values)

        const title = values.title + '_new'
        const _video = {
            title, tags: values.tags, descs: values.descs, keywords: values.keywords,
            blogger: JSON.stringify(values.blogger[0])
        }
        const _videoStr = `/videos/new?${queryString.stringify(_video)}`

        // save
        const toVideoNew = (result) => {
            // console.log(result)
            history.push(_videoStr, { refresh: true, })
        }

        processSave(values, toVideoNew)
    }

    const processSave = (values, toNext) => {
        const _video = { ...values }
        console.log('processSave', _video)

        // check video meta info from aliyun vod
        if (_video.height === 0 || _video.width === 0 || _video.seconds === 0) {
            // refetch meta info
            refetchVideoInfo()
            setMetaPopVisible(true)
            return
        }

        if (values.blogger) {
            _video.b_id = values.blogger[0].id
        }
        delete _video.blogger

        if (id) {
            delete _video.id
            delete _video._id
            updateVideo({ variables: { id: id, video: _video }, }).then(
                toNext,
                loggerError)
        } else {
            delete _video.status
            createVideo({ variables: { video: _video } }).then(
                toNext,
                loggerError)
        }
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/videos')
    }

    const handleCopied = (text, result) => {
        // const value = formData.getFieldValue('videoId')
        console.log(text, result)
        if (result) {
            message.info(`VideoID 复制成功 ${text}`)
        } else {
            message.error('VideoID 复制失败')
        }
    }

    const handleVodChange = (vodInfo) => {
        // console.log('handleVodChange', vodInfo)
        formData.setFieldsValue({ play_location: vodInfo.videoUrl, videoId: vodInfo.videoId })
        setVideoId(vodInfo.videoId)
    }

    const handleBloggerChange = (value) => {
        console.log('handleBloggerChange', value)
        formData.setFieldsValue({ b_id: value[0].id })
    }

    const getMetaInfo = () => {
        const values = formData.getFieldsValue(['title', 'cover_path', 'seconds', 'width', 'height', 'tags', 'descs'])
        return {
            Title: values.title,
            CoverURL: values.cover_path,
            Seconds: values.seconds,
            Width: values.width,
            Height: values.height,
            Tags: values.tags,
            Description: values.descs
        }
    }

    const handlePopConfirm = (values) => {
        // console.log('handlePopConfirm')
        setPopVisible(false)
        formData.setFieldsValue(sAliyunVideoInfo)
    }

    const handlePopCancel = (values) => {
        setPopVisible(false)
    }

    const handleMetaPopConfirm = (values) => {
        // console.log('handlePopConfirm')
        setMetaPopVisible(false)
        // formData.setFieldsValue(sAliyunVideoInfo)
    }

    return (
        <>
            {/*{JSON.stringify(sRecord)}*/}
            <Form {...layout} form={formData} onFinish={handleSave}
                initialValues={sRecord}>
                <Row>
                    <Col span={11}>
                        <Divider>基本信息</Divider>
                        <Popconfirm title='Aliyun VOD 上的视频标题、封面与本系统数据库不一致，是否覆盖本页数据？'
                            visible={sPopVisible}
                            onConfirm={handlePopConfirm}
                            onCancel={handlePopCancel}
                            okText='Yes'
                            cancelText='No'
                        >
                            <Form.Item name='cover_path' label='Cover(OSS)' required>
                                <OssImageUpload/>
                            </Form.Item>
                        </Popconfirm>

                        <Form.Item name='title' label='Title' required>
                            <Input/>
                        </Form.Item>
                        <Form.Item name='descs' label='Description'>
                            <TextArea rows={4}/>
                        </Form.Item>

                        <Divider>发布管理</Divider>
                        <Form.Item name='coverConfirm' label='Cover Confirm'>
                            <IsBannedInput/>
                        </Form.Item>
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
                        <Divider>上传到 Aliyun VOD</Divider>
                        <Form.Item {...tailLayout} >
                            <span style={{ color: 'red' }}>请先输入左边的各项信息，最后上传视频文件，才能将元数据带到阿里云 VOD </span>
                        </Form.Item>
                        <Form.Item name='play_location' label='Video' required>
                            <OssVodUpload onChange={handleVodChange} metaInfo={getMetaInfo}/>
                        </Form.Item>
                        <Divider>元信息，来自 Aliyun VOD</Divider>
                        <Form.Item name='videoId' label='Video ID'>
                            <Input disabled addonAfter={<CopyToClipboard text={sVideoId} onCopy={handleCopied}>
                                <span><CopyOutlined/></span>
                            </CopyToClipboard>}
                            />
                        </Form.Item>
                        <Popconfirm title='Aliyun VOD 上的视频时长、屏幕尺寸与本系统数据库不一致，自动覆盖当前数据'
                            visible={sMetaPopVisible} cancelButtonProps={{ disabled: true }}
                            onConfirm={handleMetaPopConfirm}
                            okText='Yes' cancelText='No'>
                            <Form.Item name='seconds' label='Seconds'>
                                <InputNumber disabled/>
                            </Form.Item>

                            <Form.Item label='W * H'>
                                <Group compact>
                                    <Form.Item name='width' style={{ width: '50%' }}>
                                        <InputNumber placeholder='Width' disabled/>
                                    </Form.Item>
                                    <Form.Item name='height' style={{ width: '50%' }}>
                                        <InputNumber placeholder='Height' disabled/>
                                    </Form.Item>
                                </Group>
                            </Form.Item>
                        </Popconfirm>
                        <Form.Item {...tailLayout} >
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
                        <Form.Item {...tailLayout} >
                            {!id &&
                            <Button style={{ width: '50%', margin: '0 25%' }} onClick={handleSaveAndCreate}>
                                <SnippetsOutlined/> 保存 & 新建 </Button>
                            }
                        </Form.Item>

                        <div>{JSON.stringify(error)}</div>
                        <div>{JSON.stringify(errorVideoInfo)}</div>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default EditWidget
