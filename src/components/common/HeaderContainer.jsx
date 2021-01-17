import React from 'react'
import PropTypes from 'prop-types'
import {Col, Row} from 'antd'

import UserHeader from '../../modules/login/components/UserHeader'

const HeaderContainer = ({ title }) => {
    return (
        <Row>
            <Col span={20}><h2 style={{ margin: '0 8px' }}> {title} </h2></Col>
            <Col span={4}><UserHeader/></Col>
        </Row>
    )
}

HeaderContainer.propTypes = {
    title: PropTypes.string
}

export default HeaderContainer
