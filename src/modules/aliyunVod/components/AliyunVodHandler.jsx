import React, {useEffect, useState} from 'react'
import {useHistory} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import {Button, Card, Col, Popconfirm, Row, Spin} from 'antd'
import {FormatPainterOutlined} from '@ant-design/icons'

import {DELETE_VOD_VIDEOS, FETCH_VOD_VIDEO_IDS, FETCH_ZDN_VIDEO_IDS} from '../graphql'

const ZDN_PAGE_SIZE = 1000
const VOD_DEL_PAGE_SIZE = 20

const AliyunVodHandler = () => {
    const [sVodPageNo, setVodPageNo] = useState(1)
    const [sVodScrollToken, setVodScrollToken] = useState()
    const [sVodTotal, setVodTotal] = useState(0)
    const [sVodList, setVodList] = useState(new Set())

    const [sZdnPageNo, setZdnPageNo] = useState(0)
    const [sZdnTotal, setZdnTotal] = useState(0)
    const [sZdnList, setZdnList] = useState(new Set())

    // const [sSubset, setSubset] = useState(new Set())
    const [sSubList, setSubList] = useState([])
    const [sVodDelPageNo, setVodDelPageNo] = useState(0)
    const [sVodDelVideoIds, setVodDelVideoIds] = useState()

    const history = useHistory()

    const { loading: vodLoading, error: vodError, data: vodData } = useQuery(FETCH_VOD_VIDEO_IDS, {
        variables: { pageNo: sVodPageNo, scrollToken: sVodScrollToken }
    })

    const { loading: zdnLoading, error: zdnError, data: zdnData } = useQuery(FETCH_ZDN_VIDEO_IDS, {
        variables: { offset: sZdnPageNo * ZDN_PAGE_SIZE, limit: ZDN_PAGE_SIZE }
    })

    const { loading: vodDelLoading, error: vodDelError, data: vodDelData, refetch: vodDelRefetch } = useQuery(DELETE_VOD_VIDEOS, {
        variables: { VideoIds: sVodDelVideoIds },
        skip: !sVodDelVideoIds,
    })

    // const [cleanUseless] = useMutation(DELETE_VOD_VIDEOS)

    useEffect(() => {
        if (!vodData || !vodData.vodVideoIds) {
            return
        }
        // console.log('init vodData result', vodData)

        if (vodData.vodVideoIds) {
            setVodList(new Set([...sVodList, ...vodData.vodVideoIds.list]))
            if (sVodList.size + vodData.vodVideoIds.list.length < vodData.vodVideoIds.total) {
                setVodPageNo(x => x + 1)
            }
            setVodTotal(vodData.vodVideoIds.total)
            setVodScrollToken(vodData.vodVideoIds.scrollToken)
        }
    }, [vodData])

    useEffect(() => {
        if (!zdnData || !zdnData.videoIds) {
            return
        }
        // console.log('init zdnData result', zdnData)

        if (zdnData.videoIds) {
            setZdnList(new Set([...sZdnList, ...zdnData.videoIds.list]))
            if ((sZdnList.size + zdnData.videoIds.list.length) < zdnData.videoIds.total) {
                setZdnPageNo(x => x + 1)
            }
            setZdnTotal(zdnData.videoIds.total)
        }
    }, [zdnData])

    useEffect(() => {
        if (!zdnError && !vodError) {
            return
        }
        history.push('/login')
    }, [zdnError, vodError])

    useEffect(() => {
        if (!sVodList || !sZdnList) {
            return
        }
        const newSub = new Set([...sVodList].filter(x => !sZdnList.has(x)))
        setSubList(Array.from(newSub))
    }, [sVodList, sZdnList])

    useEffect(() => {
        if (!vodDelData || !vodDelData.vodDeleteVideos) {
            return
        }
        // console.log('init zdnData result', zdnData)

        if (vodDelData.vodDeleteVideos) {
            console.log(`vodDeleteVideos result : ${sVodDelPageNo} => ${vodDelData.vodDeleteVideos}`)
            if (sSubList.length > 0) {
                // setVodDelPageNo(x => x + 1)
                const videoIds = sSubList.splice(0, VOD_DEL_PAGE_SIZE)
                console.log(videoIds.join(','))
                // setSubList(sSubList)
                setVodDelVideoIds(videoIds.join(','))
            }
        }
    }, [vodDelData])

    const handleClean = () => {
        const videoIds = sSubList.splice(0, VOD_DEL_PAGE_SIZE)
        const delVideoIds = videoIds.join(',')
        console.log('handleClean', delVideoIds)
        setVodDelVideoIds(delVideoIds)
    }

    return (
        <>
            <h2>阿里云 VOD 清理</h2>
            <Row>
                <Col span={24}>
                    <Card title='清除无用 Video 资源'>
                        <div className='centerContainer'>
                            <span style={{ color: 'red', fontSize: '2em' }}> Useless = VOD - ZDN </span>
                        </div>
                        <div className='centerContainer'>
                            <span style={{ color: 'red' }}>
                                <ul>
                                    <li>危险操作！！！一旦清除不可恢复！！！</li>
                                    <li>Aliyun VOD 中的 VideoID，如果不在 ZDN MySQL 中，即为待清除的无用视频</li>
                                    <li>请在下面的Useless清除列表加载完之后再做清除！！！</li>
                                    <li>清除时请通知大家，停止后台爬虫和在本系统操作视频！！！</li>
                                    <li>一旦开始清除，每次会从 Useless 中选择前 20 个 VideoIDs，执行清除！清除自动进行，直至 Useless 列表为空</li>
                                    <li>清除持续时间可能较长！一旦开始清除，想要停止清除过程，关掉当前页即可</li>
                                    <li>清除过程中，仅 Useless 变化，VOD 和 ZDN 列表数据不改变</li>
                                    <li>查看效果，请在清除完成后刷新此页面</li>
                                </ul>
                            </span>
                        </div>
                        <Popconfirm title={'是否清除VOD中无用的 Video 资源？'} okText={'清除'} cancelText={'取消'}
                            onConfirm={() => {
                                handleClean()
                            }}>
                            <Button type='danger' style={{ width: '20%', margin: '0 40%' }}
                                disabled={zdnLoading || vodLoading}>
                                <FormatPainterOutlined/> 清除
                            </Button>
                        </Popconfirm>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={`Useless (${sSubList.length})`}>
                        {sSubList.join(' ')}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={`VOD (${sVodList.size} / ${sVodTotal})`}>
                        {vodLoading && <Spin/>}
                        {Array.from(sVodList).join(' ')}
                        {/*{JSON.stringify(vodData)}*/}
                        {JSON.stringify(vodError)}
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title={`ZDN (${sZdnList.size} / ${sZdnTotal})`}>
                        {zdnLoading && <Spin/>}
                        {Array.from(sZdnList).join(' ')}
                        {/*{JSON.stringify(zdnData)}*/}
                        {JSON.stringify(zdnError)}
                    </Card>
                </Col>
            </Row>
        </>
    )
}

export default AliyunVodHandler
