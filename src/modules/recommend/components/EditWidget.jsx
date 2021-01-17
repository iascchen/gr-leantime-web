import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Button, Card, Col, Divider, Form, message, Row, Slider} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, tailLayout} from '../../../components/constant'
import {FETCH_VIDEO_RECOMMEND, UPDATE_VIDEO_RECOMMEND} from '../graphql'
import VideoSelectWidget from '../../video/components/VideoSelectWidget'

const MIN_THRESHOLD = 1
const MAX_THRESHOLD = 100

const RecommendAdjustPane = () => {
    const [sRecord, setRecord] = useState({
        playCount: 1,
        shareCount: 1,
        likeCount: 1,
        attenuation: 10,
        weight: 0
    })

    const [formData] = Form.useForm()

    const history = useHistory()
    const { videoId } = useParams()

    const { error, data } = useQuery(FETCH_VIDEO_RECOMMEND, {
        variables: { videoId },
        skip: !videoId
    })

    const [updateEntity] = useMutation(UPDATE_VIDEO_RECOMMEND)

    useEffect(() => {
        if (!data || !data.videoRecommendAdjust) {
            return
        }
        const _record = { ...data.videoRecommendAdjust }
        _record.videoId = [data.videoRecommendAdjust.video,]
        formData.setFieldsValue(_record)
    }, [data])

    const handleSave = (values) => {
        console.log('handleSave', values)
        const videoId = values.videoId[0].id
        values.title = values.videoId[0].title
        delete values.videoId

        const _videoAdjust = { videoId, videoRecommendAdjust: values }
        console.log(_videoAdjust)
        updateEntity({ variables: _videoAdjust }).then(
            (ret) => {
                // console.log('updateVideoLabel', ret)
                if (ret.data.updateVideoRecommendAdjust) {
                    message.info('热点调整已保存')
                    history.push('/recommend/hot')
                }
            },
            (err) => {
                message.error(err.message)
            }
        )
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/recommend/hot')
    }

    return (
        <Card title={'热点视频调整'}>
            <Form {...layout} form={formData} onFinish={handleSave} initialValues={sRecord}>
                <Row>
                    <Col span={11}>
                        <Divider>视频</Divider>
                        <Form.Item name='videoId' label='Video' required>
                            <VideoSelectWidget disabled={!!videoId}/>
                        </Form.Item>
                    </Col>
                    <Col span={1}></Col>
                    <Col span={12}>
                        <Divider>推荐调整</Divider>
                        <Form.Item name='playCount' label='调整播放量(*1000)'>
                            <Slider min={MIN_THRESHOLD} max={MAX_THRESHOLD}/>
                        </Form.Item>
                        <Form.Item name='shareCount' label='调整转发量(*1000)'>
                            <Slider min={MIN_THRESHOLD} max={MAX_THRESHOLD}/>
                        </Form.Item>
                        <Form.Item name='likeCount' label='调整收藏量(*1000)'>
                            <Slider min={MIN_THRESHOLD} max={MAX_THRESHOLD}/>
                        </Form.Item>
                        <Form.Item name='weight' label='调整权重'>
                            <Slider min={-1.0} max={1.0} step={0.01}/>
                        </Form.Item>
                        <Form.Item name='attenuation' label='热度衰减天数'>
                            <Slider min={1} max={30}/>
                        </Form.Item>

                        <Form.Item {...tailLayout}>
                            {!videoId &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}> 取消 </Button>
                            }
                            <Button type='primary' htmlType='submit' style={{ width: '30%', margin: '0 10%' }}>
                                <SaveOutlined/> 保存 </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div>{JSON.stringify(error)}</div>
        </Card>
    )
}

export default RecommendAdjustPane
