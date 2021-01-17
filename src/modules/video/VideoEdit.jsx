import React, {useEffect, useState} from 'react'
import {Tabs} from 'antd'
import {useLocation, useParams} from 'react-router-dom'

import ZdnContainer from '../../components/ZdnContainer'
import EditWidget from './components/EditWidget'
import VideoLabelTabPane from './components/VideoLabelTabPane'

const { TabPane } = Tabs

const VideoEdit = () => {
    const [sTabCurrent, setTabCurrent] = useState('1')
    const { id } = useParams()
    const location = useLocation()

    useEffect(() => {
        if (!location) {
            return
        }
        // console.log('init location', location)
        if (location.search.includes('?label')) {
            console.log('label', '2')
            setTabCurrent('2')
        }
    }, [location])

    const handleTabChange = (key) => {
        // console.log('handleTabChange', key)
        setTabCurrent(key)
    }

    return (
        <ZdnContainer>
            <h2>视频内容详情</h2>
            {/*{JSON.stringify(location)}*/}
            <Tabs activeKey={sTabCurrent} onChange={handleTabChange}>
                <TabPane tab='视频详情' key='1'>
                    <EditWidget/>
                </TabPane>
                <TabPane tab='标签' key='2' disabled={!id}>
                    <VideoLabelTabPane/>
                </TabPane>
            </Tabs>
        </ZdnContainer>
    )
}

export default VideoEdit
