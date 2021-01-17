import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import {Button, Col, Form, message, Row} from 'antd'
import {SaveOutlined} from '@ant-design/icons'
import {useMutation, useQuery} from '@apollo/react-hooks'

import {layout, normalLayout} from '../../../components/constant'
import {FETCH_WEAPPTAB_LABELS, UPDATE_WEAPPTAB_LABEL} from '../graphql'
import {FETCH_LABELS_JSON} from '../../leveledLabel/graphql'
import LabelSelectWidget from '../../leveledLabel/components/LabelSelectWidget'

const DEFAULT_PAGE_SIZE = 1000

const formatGroupLabelsArray = (_array) => {
    if (!_array) {
        return
    }
    return _array.map((v, index) => {
        return {
            label: v.name,
            // value: v.parentIds ? `${v.parentIds},${v.id}` : `${v.id}`,
            value: v.path,
            children: formatGroupLabelsArray(v.children)
        }
    })
}

const WeappTabLabelTabPane = () => {
    const [sLabelGroups, setLabelGroups] = useState()

    const [formData] = Form.useForm()

    const history = useHistory()
    const { id } = useParams()

    const { error: errorLabels, data: dataLabels } = useQuery(FETCH_LABELS_JSON, {
        variables: { limit: DEFAULT_PAGE_SIZE },
    })

    const { error: errorTabLabels, data: dataTabLabels } = useQuery(FETCH_WEAPPTAB_LABELS, {
        variables: { tabId: id },
    })

    const [updateVideoLabel] = useMutation(UPDATE_WEAPPTAB_LABEL)

    useEffect(() => {
        if (!dataLabels || !dataLabels.labelsJson || !dataLabels.labelsJson.entities) {
            return
        }
        const _array = formatGroupLabelsArray(dataLabels.labelsJson.entities)
        setLabelGroups(_array)
    }, [dataLabels])

    useEffect(() => {
        if (!dataTabLabels || !dataTabLabels.weappTabLabels) {
            return
        }
        formData.setFieldsValue({ labels: JSON.parse(dataTabLabels.weappTabLabels.labels) })
    }, [dataTabLabels])

    const handleSave = (values) => {
        console.log('handleSave', values)

        const level1 = new Set()
        const level2 = new Set()
        const level3 = new Set()
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
            })
        }

        const _tabLabel = {
            tabId: id,
            label: {
                labelLevel1: Array.from(level1).join(','),
                labelLevel2: Array.from(level2).join(','),
                labelLevel3: Array.from(level3).join(','),
                labels: JSON.stringify(values.labels)
            }
        }
        // console.log(_videoLabel)
        updateVideoLabel({ variables: _tabLabel }).then(
            (ret) => {
                if (ret.data.updateWeappTabLabel) {
                    message.info('标签已保存')
                }
            },
            (err) => {
                message.error(err.message)
            }
        )
    }

    const handleCancel = (values) => {
        // console.log('handleCancel')
        history.push('/weapptabs')
    }

    return (
        <>
            <Form {...layout} form={formData} onFinish={handleSave}>
                <Row>
                    <Col span={18} offset={2}>
                        <Form.Item name='labels' {...normalLayout}>
                            <LabelSelectWidget options={sLabelGroups}/>
                        </Form.Item>
                        <Form.Item>
                            {!id &&
                            <Button style={{ width: '30%', margin: '0 10%' }} onClick={handleCancel}> 取消 </Button>
                            }
                            <Button type='primary' htmlType='submit' style={{ width: '30%', margin: '0 10%' }}>
                                <SaveOutlined/> 保存 </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div>{JSON.stringify(errorLabels)}</div>
            <div>{JSON.stringify(errorTabLabels)}</div>
        </>
    )
}

export default WeappTabLabelTabPane
