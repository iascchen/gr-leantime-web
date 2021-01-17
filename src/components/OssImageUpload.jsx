import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {message, Upload} from 'antd'
import {FileAddOutlined, LoadingOutlined} from '@ant-design/icons'

import {getSignature, todayKey} from '../constant'
import {aliyunOss} from '../utils/secrets'


export const policyText = {
    expiration: '2028-01-01T12:00:00.000Z', // 设置该Policy的失效时间，
    conditions: [
        ['content-length-range', 0, 1048576000] // 设置上传文件的大小限制
    ]
}
export const policyBase64 = Buffer.from(JSON.stringify(policyText)).toString('base64')

const PIC_MAX_SIZE = 2
export const beforeImageUpload = (file) => {
    // console.log('file info', file)

    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isBMP = file.type === 'image/bmp'
    const isGIF = file.type === 'image/gif'
    const isWEBP = file.type === 'image/webp'
    const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP
    if (!isPic) {
        message.error('You can only upload JPG/PNG/BMP/GIF/WEBP file!')
    }

    const isLtSize = file.size / 1024 / 1024 < PIC_MAX_SIZE
    if (!isLtSize) {
        message.error(`Image must smaller than ${PIC_MAX_SIZE}MB!`)
    }
    return isPic && isLtSize
}

const OssImageUpload = ({ onChange, value }) => {
    const [sUploading, setUploading] = useState(false)
    const [sUpdateSrc, setUpdateSrc] = useState()

    useEffect(() => {
        if (!value) {
            return
        }
        setUpdateSrc(value)
    }, [value])

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            // console.log('Image uploading', info)
            setUploading(true)
            return
        }
        if (info.file.status === 'done') {
            // console.log('Image uploaded', info)
            const imageUrl = `${aliyunOss.bucket}/${todayKey}/${info.file.name}`
            setUpdateSrc(imageUrl)
            setUploading(false)

            onChange && onChange(imageUrl)
        }
    }

    const uploadButton = (
        <div>
            {sUploading ? <LoadingOutlined/> : <FileAddOutlined/>}
            <div className='ant-upload-text'>上传图片</div>
        </div>
    )

    return (
        <Upload listType='picture-card' className='img-uploader centerContainer' showUploadList={false}
            accept='.jpg,.jpeg,.png,.bmp,.gif,.webp'
            action={aliyunOss.bucket} beforeUpload={beforeImageUpload} onChange={handleChange}
            data={{
                key: todayKey + '/${filename}',
                policy: policyBase64,
                OSSAccessKeyId: aliyunOss.accessKeyId,
                signature: getSignature(policyBase64, aliyunOss.secretAccessKey),
                success_action_status: 200,
            }}
        >
            {sUpdateSrc ? <img src={sUpdateSrc} alt='preview' style={{ height: '100%' }} /> : uploadButton}
        </Upload>
    )
}

OssImageUpload.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
}

export default OssImageUpload
