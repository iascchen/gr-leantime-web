import React, {useEffect, useRef, useState} from 'react'
import PropTypes from 'prop-types'
import useScript from 'react-script-hook'
import {Button, message, Upload} from 'antd'
import {
    CopyOutlined,
    DownloadOutlined,
    LoadingOutlined,
    PauseCircleOutlined,
    PlayCircleOutlined,
    VideoCameraAddOutlined
} from '@ant-design/icons'
import {useQuery} from '@apollo/react-hooks'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import {aliyunVod} from '../../../utils/secrets'
import {VOD_CREATE_UPLOAD_VIDEO, VOD_REFRESH_UPLOAD_VIDEO} from '../graphql'

const VIDEO_MAX_SIZE = 100
export const beforeVideoUpload = (file) => {
    // console.log('file info', file)
    const isMP4 = file.type === 'video/mp4'
    const isMPEG = file.type === 'video/mpeg'
    const isMOV = file.type === 'video/quicktime'
    const isAVI = file.type === 'video/x-msvideo'
    const isWMV = file.type === 'video/x-ms-wmv'
    const isVideo = isMP4 || isMPEG || isMOV || isAVI || isWMV
    if (!isVideo) {
        message.error('You can only upload MP4/MPEG/MOV/AVI/WMV file!')
    }

    const isLtSize = file.size / 1024 / 1024 < VIDEO_MAX_SIZE
    if (!isLtSize) {
        message.error(`Video must smaller than ${VIDEO_MAX_SIZE}MB!`)
    }
    return isVideo && isLtSize
}

const OssVodUpload = ({ value, onChange, metaInfo }) => {
    const [ossSdkLoading] = useScript({
        src: '/lib/aliyun-upload-sdk/lib/aliyun-oss-sdk-5.3.1.min.js',
        checkForExisting: true,
        onload: () => console.log('aliyun-oss-sdk loaded!'),
    })
    const [vodUploadLoading] = useScript({
        src: '/lib/aliyun-upload-sdk/aliyun-upload-sdk-1.5.0.min.js',
        checkForExisting: true,
        onload: () => console.log('aliyun-upload-sdk loaded!'),
    })

    const [sUploader, setUploader] = useState()
    const [sVodInfo, setVodInfo] = useState()
    const [sVodVideoId, setVodVideoId] = useState()

    const [sUploading, setUploading] = useState(false)
    const [sUpdateSrc, setUpdateSrc] = useState()

    const videoRef = useRef()
    const [sVideoPlaying, setVideoPlaying] = useState(false)

    const { refetch: refetchCreate } = useQuery(VOD_CREATE_UPLOAD_VIDEO, {
        variables: sVodInfo,
        skip: !sVodInfo,
    })
    const { refetch: refetchRefresh } = useQuery(VOD_REFRESH_UPLOAD_VIDEO, {
        variables: sVodVideoId,
        skip: !sVodVideoId,
    })

    useEffect(() => {
        // console.log('script loading', vodUploadLoading, ossSdkLoading)
        if (!aliyunVod || vodUploadLoading || ossSdkLoading) {
            return
        }
        console.log('init uploader')

        // eslint-disable-next-line no-undef
        const uploader = new AliyunUpload.Vod({
            //阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
            userId: aliyunVod.userId,
            //上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
            region: aliyunVod.region,
            //分片大小默认1M，不能小于100K
            partSize: 1048576,
            //并行上传分片个数，默认5
            parallel: 5,
            //网络原因失败时，重新上传次数，默认为3
            retryCount: 3,
            //网络原因失败时，重新上传间隔时间，默认为2秒
            retryDuration: 2,
            // 超时
            timeout: 60000,
            // 添加文件成功
            addFileSuccess: (uploadInfo) => {
                console.log('addFileSuccess: ' + uploadInfo.file.name)
            },
            // 开始上传
            'onUploadstarted': (uploadInfo) => {
                console.log('onUploadStarted:', uploadInfo)
                const getVodReq = async () => {
                    try {
                        const vodReqResult = await refetchCreate()
                        //从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
                        const { UploadAuth, UploadAddress, VideoId } = vodReqResult.data.vodCreateUploadVideo
                        // console.log('vodReqResult detail', UploadAuth, UploadAddress, VideoId)

                        setVodVideoId({ VideoId })
                        uploader.setUploadAuthAndAddress(uploadInfo, UploadAuth, UploadAddress, VideoId)
                    } catch (e) {
                        console.log('in getVodReq error', e)
                    }
                }

                getVodReq()
            },
            // 文件上传成功
            'onUploadSucceed': (uploadInfo) => {
                console.log('onUploadSucceed:', uploadInfo)

                const videoUrl = `https://${uploadInfo.bucket}.oss-${uploadInfo.region}.aliyuncs.com/${uploadInfo.object}`
                // console.log(videoUrl)

                setUpdateSrc(videoUrl)
                setUploading(false)
                message.info('文件上传完成')

                onChange && onChange({ videoUrl, videoId: uploadInfo.videoId })
            },
            // 文件上传失败
            'onUploadFailed': (uploadInfo, code, msg) => {
                const _msg = 'onUploadFailed: file:' + uploadInfo.file.name + ',code:' + code + ', message:' + msg
                message.error(_msg)
                setUploading(false)
            },
            // 文件上传进度，单位：字节
            'onUploadProgress': (uploadInfo, totalSize, loadedPercent) => {
                console.log('onUploadProgress:', uploadInfo, totalSize, loadedPercent + '%')
                // console.log('onUploadProgress:file:' + uploadInfo.file.name + ', fileSize:' + totalSize +
                //     ', percent:' + Math.ceil(loadedPercent * 100) + '%')
            },
            // 上传凭证超时
            'onUploadTokenExpired': (uploadInfo) => {
                console.log('onUploadTokenExpired:', uploadInfo)
                const refreshVodReq = async () => {
                    if (!sVodVideoId) {
                        return
                    }
                    console.log('in refreshVodReq')
                    //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth.(https://help.aliyun.com/document_detail/55408.html)
                    const vodReqResult = await refetchRefresh()
                    console.log('vodReqResult', vodReqResult)

                    const { UploadAuth } = vodReqResult.data.vodRefreshUploadVideo
                    //从点播服务刷新的uploadAuth,设置到SDK里
                    uploader.resumeUploadWithAuth(UploadAuth)
                }

                refreshVodReq()
            },
            //全部文件上传结束
            'onUploadEnd': (uploadInfo) => {
                console.log('onUploadEnd: uploaded all the files', uploadInfo)

                setVodVideoId(undefined)
                setVodInfo()
                // setUploading(false)
            }
        })

        setUploader(uploader)
    }, [vodUploadLoading, ossSdkLoading, refetchCreate, refetchRefresh])

    useEffect(() => {
        if (!value) {
            return
        }
        setUpdateSrc(value)
    }, [value])

    const handleChange = (info) => {
        // console.log('handleChange')
        if (info.file.status === 'uploading') {
            // console.log('Video uploading', info)
            setUploading(true)
            return
        }

        if (info.file.status === 'done') {
            console.log('Video uploaded', info)
            setUploading(false)
        }
    }

    const handleUpload = async (file) => {
        if (!sUploader) {
            return
        }
        console.log('handleUpload', file)

        // get meta info from parent form
        const fileInfo = (metaInfo && metaInfo()) || {}
        fileInfo.FileName = file.name
        // console.log('file info', fileInfo)

        setVodInfo(fileInfo)

        sUploader.addFile(file, null, null, null, null)
        sUploader.startUpload()
    }

    const handlePlay = () => {
        if (!videoRef.current) {
            return
        }
        sVideoPlaying ? videoRef.current.pause() : videoRef.current.play()
        setVideoPlaying(!sVideoPlaying)
    }

    const handleCopied = (text, result) => {
        // const value = formData.getFieldValue('videoId')
        console.log(text, result)
        if (result) {
            message.info(`Video URI 复制成功 ${text}`)
        } else {
            message.error('Video URI 复制失败')
        }
    }

    const uploadButton = (
        <div>
            {sUploading ? <LoadingOutlined/> : <VideoCameraAddOutlined/>}
            <div className='ant-upload-text'>上传视频</div>
        </div>
    )

    return (
        <>
            <Upload listType='picture-card' className='video-uploader centerContainer' showUploadList={false}
                accept='.mp4,.mpeg,.mov,.avi,.wmv'
                action={handleUpload} beforeUpload={beforeVideoUpload} onChange={handleChange}
            >
                {sUpdateSrc
                    ? <video ref={videoRef} src={sUpdateSrc} alt='video'
                        style={{ height: '360px', maxHeight: '100%', maxWidth: '100%' }}/>
                    : uploadButton}
            </Upload>
            <div className='centerContainer'>
                {sUpdateSrc && <>
                    <Button shape='circle' type='dashed' onClick={handlePlay} style={{ backgroundColor: '#ebba6b' }}>
                        {sVideoPlaying ? <PauseCircleOutlined/> : <PlayCircleOutlined/>}
                    </Button> &nbsp;&nbsp;&nbsp;&nbsp;
                    <a href={sUpdateSrc} target='_blank' rel='noreferrer noopener' download>
                        <Button shape='circle'><DownloadOutlined/></Button>
                    </a> &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button shape='circle'>
                        <CopyToClipboard text={sUpdateSrc} onCopy={handleCopied}>
                            <CopyOutlined/>
                        </CopyToClipboard>
                    </Button>
                </>
                }
            </div>
        </>
    )
}

OssVodUpload.propTypes = {
    value: PropTypes.string,

    onChange: PropTypes.func,
    metaInfo: PropTypes.func,
}

export default OssVodUpload
