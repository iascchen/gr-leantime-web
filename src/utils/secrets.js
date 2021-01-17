export const ENVIRONMENT = process.env.NODE_ENV

export const ZDN_SERVER_BASE = process.env.REACT_APP_ZDN_SERVER_BASE

// for login
export const ACCOUNT_CENTER = ZDN_SERVER_BASE
export const HEADER_FOR_AUTH = process.env.REACT_APP_HEADER_FOR_AUTH || 'token'
export const PASSWORD_RESET_TOKEN_LEN = process.env.REACT_APP_PASSWORD_RESET_TOKEN_LEN || 6
export const INVITE_TOKEN_TTL = process.env.REACT_APP_INVITE_TOKEN_TTL || 60

// for video resource management
export const ALIYUN_ACCOUNT_ID = process.env.REACT_APP_ALIYUN_ACCOUNT_ID
export const ALIYUN_VOD_REGION = process.env.REACT_APP_ALIYUN_VOD_REGION

if (!ZDN_SERVER_BASE) {
    console.error('No ZDN server uri. Set REACT_APP_ZDN_SERVER_BASE environment variable.')
}

if (
    !ALIYUN_VOD_REGION || !ALIYUN_ACCOUNT_ID
    // || !ALIYUN_VOD_ID || !ALIYUN_VOD_KEY
) {
    console.error('No aliyun vod access secret. Set REACT_APP_ALIYUN_ACCOUNT_ID, REACT_APP_ALIYUN_VOD_REGION, ' +
        'environment variable.')
}

export const aliyunVod = {
    region: ALIYUN_VOD_REGION,
    userId: ALIYUN_ACCOUNT_ID,
    endpoint: `https://vod.${ALIYUN_VOD_REGION}.aliyuncs.com`,
    apiVersion: '2017-03-21'
}

export const ALIYUN_OSS_BUCKET = process.env.REACT_APP_ALIYUN_OSS_BUCKET
export const ALIYUN_OSS_ID = process.env.REACT_APP_ALIYUN_OSS_ID
export const ALIYUN_OSS_KEY = process.env.REACT_APP_ALIYUN_OSS_KEY

export const aliyunOss = {
    bucket: ALIYUN_OSS_BUCKET,
    accessKeyId: ALIYUN_OSS_ID,
    secretAccessKey: ALIYUN_OSS_KEY,
}
