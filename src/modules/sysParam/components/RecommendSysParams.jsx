import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import {Button, Card, Col, Form, message, Row, Slider, Spin} from 'antd'
import {SaveOutlined} from '@ant-design/icons'

import {layout, loggerError, tailLayout} from '../../../components/constant'
import {FETCH_SYSPARAMS, UPDATE_SYSPARAM} from '../graphql'

const KEYS = [
    'VideoPlayCountThreshold', 'VideoShareCountThreshold', 'VideoLikeCountThreshold',
    'VideoPlayCountWeight', 'VideoShareCountWeight', 'VideoLikeCountWeight',
    'AdjustWeight', 'HotAttenuation']

const MIN_THRESHOLD = 1
const MAX_THRESHOLD = 100

const CountWeightMasks = {
    0: '播放',
    // 0.5: '转发',
    1: '收藏',
}

const RecommendSysParams = () => {
    const [sFilter] = useState({ keys: KEYS.join(',') })

    const [sRecord, setRecord] = useState({
        VideoPlayCountThreshold: 1,
        VideoShareCountThreshold: 1,
        VideoLikeCountThreshold: 5,
        VideoPlayCountWeight: 0.1,
        VideoShareCountWeight: 0.3,
        VideoLikeCountWeight: 0.6,
        CountWeight: [0.1, 0.4],
        AdjustWeight: 0,
        HotAttenuation: 10
    })

    const [formData] = Form.useForm()

    const history = useHistory()

    const { loading, error, data } = useQuery(FETCH_SYSPARAMS, {
        variables: { ...sFilter },
        credentials: 'include',
    })
    const [updateSysParam] = useMutation(UPDATE_SYSPARAM)

    useEffect(() => {
        if (!data || !data.sysParams) {
            return
        }
        console.log('init result', data)

        const record = {}
        if (data.sysParams) {
            data.sysParams.forEach(v => {
                record[v.key] = Number(v.value)
            })

            record.CountWeight = [record.VideoPlayCountWeight, record.VideoPlayCountWeight + record.VideoShareCountWeight]
            setRecord(record)
            formData.setFieldsValue(record)
        }
    }, [data])

    useEffect(() => {
        if (!error) {
            return
        }
        history.push('/login')
    }, [error])

    const handleSave = (values) => {
        // console.log('handleSave', values)

        const countWeights = {
            VideoPlayCountWeight: values.CountWeight[0],
            VideoShareCountWeight: (values.CountWeight[1] - values.CountWeight[0]).toFixed(2),
            VideoLikeCountWeight: (1 - values.CountWeight[1]).toFixed(2)
        }
        const _sysParams = { ...values, ...countWeights }
        delete _sysParams.CountWeight

        const sysParams = Object.keys(_sysParams).map(k => {
            return { key: k, value: _sysParams[k].toString() }
        })
        console.log('handleSave', sysParams)

        updateSysParam({ variables: { params: sysParams } }).then(
            (ret) => {
                console.log(ret)
                message.info('参数已保存')
            },
            loggerError)
    }

    return (
        <>
            <h2>推荐策略默认参数</h2>
            <Row>
                <Col span={16}>
                    <Card title='热点召回默认参数'>
                        <Form {...layout} form={formData} onFinish={handleSave}
                            initialValues={sRecord}>
                            <Form.Item name='VideoPlayCountThreshold' label='播放量阈值(*1000)'>
                                <Slider min={MIN_THRESHOLD} max={MAX_THRESHOLD}/>
                            </Form.Item>
                            <Form.Item name='VideoShareCountThreshold' label='转发量阈值(*1000)'>
                                <Slider min={MIN_THRESHOLD} max={MAX_THRESHOLD}/>
                            </Form.Item>
                            <Form.Item name='VideoLikeCountThreshold' label='收藏量阈值(*100)'>
                                <Slider min={MIN_THRESHOLD} max={MAX_THRESHOLD * 10}/>
                            </Form.Item>
                            <Form.Item name='CountWeight' label='权重比率(播放/转发/收藏)'>
                                <Slider range min={0} max={1.0} step={0.01} marks={CountWeightMasks}/>
                            </Form.Item>
                            <Form.Item name='AdjustWeight' label='调整权重'>
                                <Slider min={-1.0} max={1.0} step={0.01}/>
                            </Form.Item>
                            <Form.Item name='HotAttenuation' label='热度衰减天数'>
                                <Slider min={1} max={30}/>
                            </Form.Item>

                            <Form.Item {...tailLayout} >
                                <Button type='primary' htmlType='submit'
                                    style={{ width: '40%', margin: '0 30%' }}><SaveOutlined/> 保存 </Button>
                            </Form.Item>
                            {/*<div>{JSON.stringify(_formdata)}</div>*/}
                            <div>{JSON.stringify(error)}</div>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <Row>
                {loading && <Spin/>}
                {/*{JSON.stringify(sRecord)}*/}
                {JSON.stringify(error)}
            </Row>

        </>
    )
}

export default RecommendSysParams
