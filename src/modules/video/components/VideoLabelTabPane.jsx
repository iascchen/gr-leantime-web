import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Button, Card, Col, Form, message, Popconfirm, Row, Select, Steps} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {Sticky, StickyContainer} from 'react-sticky'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, normalLayout} from '../../../components/constant'
import {FETCH_VIDEO_INFO, FETCH_VIDEO_LABELS, UPDATE_VIDEO_LABEL} from '../graphql'
import {FETCH_LABELS_JSON} from '../../leveledLabel/graphql'
import LabelSelectWidget from '../../leveledLabel/components/LabelSelectWidget'
import OssImageUpload from '../../../components/OssImageUpload'
import OssVodUpload from './OssVodUpload'

const { Option } = Select

const DEFAULT_PAGE_SIZE = 1000

export const TARGET_TYPES = [
    { label: '封面标签', value: 'cover' },
    { label: '文案标签', value: 'text' },
    { label: '视频标签', value: 'video' },
    { label: '音频标签', value: 'audio' },
    { label: '昵称标签', value: 'nick' },
    { label: '个性标签', value: 'spec' }
]

const { Step } = Steps

const formatGroupLabelsArray = (_array) => {
    if (!_array) {
        return
    }
    return _array.map((v, index) => {
        return {
            id: v.id,
            label: v.name,
            value: v.path,
            children: formatGroupLabelsArray(v.children)
        }
    })
}

const selectTargetLabels = (targets, filter) => {
    if (!targets) {
        return
    }
    const _target = targets.filter((v) => {
        return v.target === filter.value
    })
    // console.log(targets, filter, _target)
    return _target[0] ? _target[0].labels : []
}

const VideoLabelTabPane = () => {
    const [sLabelGroups, setLabelGroups] = useState()
    const [sVideo, setVideo] = useState()
    const [sVodVideoId, setVodVideoId] = useState()
    const [sPlayUrl, setPlayUrl] = useState()
    const [sTargets, setTargets] = useState()
    const [sCurStep, setCurStep] = useState(0)

    const [sNextStep, setNextStep] = useState(0)
    const [sPopTitle, setPopTitle] = useState()
    const [sPopVisible, setPopVisible] = useState(false)

    const [formData] = Form.useForm()

    const { id } = useParams()

    const { error: errorLabels, data: dataLabels } = useQuery(FETCH_LABELS_JSON, {
        variables: { limit: DEFAULT_PAGE_SIZE },
    })

    const { error: errorVideoLabels, data: dataVideoLabels, refetch: refetchVideoLabels } = useQuery(FETCH_VIDEO_LABELS, {
        variables: { videoId: id },
    })

    const { error: errorVideoInfo, data: dataVideoInfo } = useQuery(FETCH_VIDEO_INFO, {
        variables: { VideoId: sVodVideoId },
        skip: !sVodVideoId,
    })

    const [updateVideoLabel] = useMutation(UPDATE_VIDEO_LABEL)

    useEffect(() => {
        if (!dataLabels || !dataLabels.labelsJson || !dataLabels.labelsJson.entities) {
            return
        }
        const _array = formatGroupLabelsArray(dataLabels.labelsJson.entities)
        setLabelGroups(_array)
    }, [dataLabels])

    useEffect(() => {
        if (!dataVideoLabels || !dataVideoLabels.videoLabels) {
            return
        }
        setVideo(dataVideoLabels.videoLabels.video)

        // console.log('video', dataVideoLabels.videoLabels.video)
        setVodVideoId(dataVideoLabels.videoLabels.video.videoId)
        setTargets(dataVideoLabels.videoLabels.targets)
    }, [dataVideoLabels])

    useEffect(() => {
        if (!sTargets || sCurStep < 0) {
            return
        }

        const target = TARGET_TYPES[sCurStep]
        const _target = selectTargetLabels(sTargets, target)
        // console.log('handleTargetChange', _target)
        formData.setFieldsValue({
            target: target.value,
            labels: _target
        })
    }, [sTargets, sCurStep])

    useEffect(() => {
        if (!dataVideoInfo || !dataVideoInfo.vodGetPlayInfo
            || !dataVideoInfo.vodGetPlayInfo.PlayInfo || !dataVideoInfo.vodGetPlayInfo.VideoBase) {
            return
        }
        // console.log('dataVideoInfo.vodGetPlayInfo', dataVideoInfo.vodGetPlayInfo)
        const { PlayURL } = dataVideoInfo.vodGetPlayInfo.PlayInfo
        // console.log(PlayURL, sVideo.play_location)
        setPlayUrl(PlayURL)
    }, [dataVideoInfo])

    const handleUpdate = (values) => {
        console.log('handleUpdate', values)
    }

    const handleSave = (values) => {
        console.log('handleSave', values)

        const level1 = new Set()
        const level2 = new Set()
        const level3 = new Set()
        const level4 = new Set()
        if (values.labels) {
            values.labels.forEach(v => {
                const _array = v.split(',')
                console.log(_array)
                if (_array[1]) {
                    level1.add(_array[1])
                }
                if (_array[2]) {
                    level2.add(_array[2])
                }
                if (_array[3]) {
                    level3.add(_array[3])
                }
                if (_array[4]) {
                    level4.add(_array[4])
                }
            })
        }

        const _videoLabel = {
            videoId: id,
            target: values.target,
            label: {
                labelLevel1: Array.from(level1).join(','),
                labelLevel2: Array.from(level2).join(','),
                labelLevel3: Array.from(level3).join(','),
                labelLevel4: Array.from(level4).join(','),
                labels: JSON.stringify(values.labels)
            }
        }
        console.log(_videoLabel)
        updateVideoLabel({ variables: _videoLabel }).then(
            (ret) => {
                // console.log('updateVideoLabel', ret)
                if (ret.data.updateVideoLabel) {
                    message.info('标签已保存')
                    refetchVideoLabels().then()
                }
            },
            (err) => {
                message.error(err.message)
            }
        )
    }

    const handleTargetChange = (current) => {
        // console.log('onChange:', current)
        const labels = formData.getFieldValue('labels')
        // console.log('handleTargetChange labels', labels)
        if (labels === '[]' || labels.length === 0) {
            setPopTitle(`未选择任何 ${formData.getFieldValue('target')} 标签！`)
            setPopVisible(true)
            setNextStep(current)
        } else if (typeof labels === 'string') {
            setPopVisible(false)
            setCurStep(current)
        } else {
            setPopTitle(`您尚未保存 ${formData.getFieldValue('target')} 标签修改！`)
            setPopVisible(true)
            setNextStep(current)
        }
    }

    return (
        <Row>
            <Col span={6}>
                {sVideo &&
                <>
                    Cover :
                    <OssImageUpload value={sVideo.cover_path}/>
                </>
                }
                {sPlayUrl &&
                <>
                    Video :
                    <OssVodUpload value={sPlayUrl}/>
                </>
                }
            </Col>
            <Col span={18} style={{ padding: 16 }}>
                <StickyContainer>
                    <Sticky>{
                        ({ style }) => {
                            const _style = { zIndex: 1, backgroundColor: 'white', padding: 8, ...style }
                            return <div style={_style}>
                                <Popconfirm placement='bottom'
                                    title={sPopTitle}
                                    okText={'保存'} cancelText={'忽略'}
                                    visible={sPopVisible}
                                    onConfirm={() => {
                                        formData.submit()
                                        setPopVisible(false)
                                        setCurStep(sNextStep)
                                    }} onCancel={() => {
                                        setPopVisible(false)
                                        setCurStep(sNextStep)
                                    }}>
                                    <Steps size='small' current={sCurStep} onChange={handleTargetChange}>
                                        {TARGET_TYPES.map(v => (
                                            <Step title={v.label} key={v.value}/>
                                        ))}
                                    </Steps>
                                </Popconfirm>
                                <div style={{ color: 'red' }}>请您主动保存！否则，关闭本窗口会造成当前标签修改丢失！</div>
                            </div>
                        }
                    }
                    </Sticky>

                    <Card>
                        <Form {...layout} form={formData} onFinish={handleSave} onValuesChange={handleUpdate}>
                            <Form.Item name='target' {...normalLayout} >
                                <Select disabled>
                                    {TARGET_TYPES.map((v) => {
                                        return <Option key={v.value} value={v.value}>{v.label} : {v.value}</Option>
                                    })}
                                </Select>
                            </Form.Item>
                            <Form.Item name='labels' {...normalLayout}>
                                <LabelSelectWidget options={sLabelGroups}/>
                            </Form.Item>
                            <Form.Item {...normalLayout}>
                                <Button type='primary' htmlType='submit' style={{ width: '30%', margin: '0 35%' }}>
                                    <SaveOutlined/> 保存 </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                    {/*<div>{JSON.stringify(dataVideoLabels)}</div>*/}
                    {/*<div>{JSON.stringify(sTargets)}</div>*/}
                    <div>{JSON.stringify(errorLabels)}</div>
                    <div>{JSON.stringify(errorVideoLabels)}</div>
                    <div>{JSON.stringify(errorVideoInfo)}</div>
                </StickyContainer>
            </Col>
        </Row>
    )
}

export default VideoLabelTabPane
