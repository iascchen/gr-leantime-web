import moment from 'moment'
import CryptoJS from 'crypto-js'

export const ZDN_COOKIE_USER = 'zdn-user'
export const ZDN_TOKEN_KEY = 'zdnTokens'

export const getBase64 = (img, callback) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
}

// Upload to browser
const handleUpload = async (file) => {
    // logger(file)
    return getUploadFileBase64(file)
}

export const getUploadFileBase64 = async (blob) => {
    if (!blob) {
        throw (new Error('File Blob is undefined'))
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        // logger('blob', JSON.stringify(blob))
        reader.onload = () => {
            const text = reader.result?.toString()
            // logger('getUploadFileBase64', text)
            resolve(text)
        }
        reader.onerror = error => reject(error)
        reader.readAsDataURL(blob)
    })
}

// Upload to OSS
export const todayKey = moment().format('YYYYMMDD')

export const getSignature = (policy, secretAccessKey) => {
    const bytes = CryptoJS.HmacSHA1(policy, secretAccessKey || 'xxx', { asBytes: true })
    return bytes.toString(CryptoJS.enc.Base64)
}

// parse aliyun VOD request return
// reference : https://help.aliyun.com/document_detail/55397.html?spm=a2c4g.11186623.6.647.21301446FlqSyp
export const parseVodRequest = (vodRequest) => {
    // console.log('parseVodRequest', vodRequest)

    const address = Buffer.from(vodRequest.UploadAddress, 'base64').toString()
    const addressObj = JSON.parse(address)

    const auth = Buffer.from(vodRequest.UploadAuth, 'base64').toString()
    const authObj = JSON.parse(auth)

    const vodReq = {
        vidoeId: vodRequest.VidoeId,

        endpoint: addressObj.Endpoint,
        bucket: addressObj.Bucket,
        fileName: addressObj.FileName,

        accessKeyId: authObj.AccessKeyId,
        accessKeySecret: authObj.AccessKeySecret,
        stsToken: authObj.SecurityToken,
        region: authObj.Region,
    }
    // console.log('vodRequest', vodRequest)
    return vodReq
}

