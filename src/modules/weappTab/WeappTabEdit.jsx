import React, {useEffect, useState} from 'react'
import {Tabs} from 'antd'

import ZdnContainer from '../../components/ZdnContainer'
import EditWidget from './components/EditWidget'
import WeappTabLabelTabPane from './components/WeappTabLabelTabPane'
import {useLocation, useParams} from 'react-router-dom'

const { TabPane } = Tabs

const WeappTabEdit = () => {
    const [sTabCurrent, setTabCurrent] = useState('1')
    const { id } = useParams()
    const location = useLocation()

    useEffect(() => {
        if (!location) {
            return
        }

        console.log('init location', location)
        if (location.search.includes('tag')) {
            console.log('tab', '2')
            setTabCurrent('2')
        }
    }, [location])

    const handleTabChange = (key) => {
        // console.log('handleTabChange', key)
        setTabCurrent(key)
    }

    return (<ZdnContainer>
        <h2>小程序频道详情</h2>
        {/*{JSON.stringify(location)}*/}
        <Tabs activeKey={sTabCurrent} onChange={handleTabChange}>
            <TabPane tab='频道详情' key='1'>
                <EditWidget/>
            </TabPane>
            <TabPane tab='标签' key='2' disabled={!id}>
                <WeappTabLabelTabPane/>
            </TabPane>
        </Tabs>
    </ZdnContainer>)
}

export default WeappTabEdit
