import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {Input, Select} from 'antd'

import {getCities, getCity, getCityId, getProvinceId, PROVINCES} from './province'

const { Option } = Select
const { Group } = Input

// const provinceData = PROVINCES
const defaultProvince = PROVINCES[0].id
const defaultCity = getCities(defaultProvince)[0].id

const ProvinceCityInput = ({ onChange, value }) => {
    const [sCities, setCities] = useState([])

    const [sProvince, setProvince] = useState(defaultProvince)
    const [sCity, setCity] = useState(defaultCity)

    useEffect(() => {
        if (!value) {
            return
        }
        // { province, city }
        const p = getProvinceId(value.province)
        const c = getCityId(value.province, value.city)
        // console.log('setValue', p,c)

        const _cities = getCities(p)
        setCities(_cities)

        setProvince(p)
        setCity(c)
    }, [value])

    useEffect(() => {
        if (!sProvince || !sCity) {
            return
        }

        const _city = getCity(sProvince, sCity)
        // console.log(_city)
        if (_city) {
            onChange && onChange({ province: _city.province, city: _city.name })
        }
    }, [sCity])

    const handleProvinceChange = v => {
        const _cities = getCities(v)
        setCities(_cities)

        setProvince(v)
        setCity(_cities[0].id)
    }

    const handleCityChange = v => {
        setCity(v)

        const _city = getCity(sProvince, v)
        // console.log(_city)
        if (_city) {
            onChange && onChange({ province: _city.province, city: _city.name })
        }
    }

    return (<Group compact>
        <Select style={{ width: '50%' }} value={sProvince} onChange={handleProvinceChange}>
            {PROVINCES.map(province => (
                <Option key={province.id}>{province.name}</Option>
            ))}
        </Select>
        <Select style={{ width: '50%' }} value={sCity} onChange={handleCityChange}>
            {sCities.map(city => (
                <Option key={city.id}>{city.name}</Option>
            ))}
        </Select>
    </Group>)
}

ProvinceCityInput.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
}

export default ProvinceCityInput
