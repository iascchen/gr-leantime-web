# zdnAdminWeb

## Aliyun 配置说明

### RAM 访问控制

#### 创建 RAM 用户组

1。用户组名：zdnResourceAdmin ； 显示名称：“正当年”媒资管理员
2。添加权限：AliyunOSSFullAccess ，AliyunVODFullAccess

#### 创建 RAM 用户

1. 创建账号：vod-admin，选择访问方式为：编程访问。
2. 将此用户加入用户组：zdnResourceAdmin
3. 记录下此用户的 AccessKey ID 和 AccessKey。

### 为封面上传准备 OSS Bucket

1. 在 ALiyun 上创建 OSS bucket。如： zdn-video-cover
2. 权限管理 
    * 读写权限 Bucket ACL 设置为：公共读
    * Bucket 授权策略, 新增授权：vod-admin， 完全控制
    * 跨域设置 根据需啊哟设定。例如：来源 设置IP。允许Method：GET、POST、PUT。允许 Header *。
    
"视频封面" 的上传要求的系统环境变量设置：

    # ALIYUN OSS
    REACT_APP_ALIYUN_OSS_BUCKET=https://xxxx.oss-cn-shanghai.aliyuncs.com
    REACT_APP_ALIYUN_OSS_ID=xxxx
    REACT_APP_ALIYUN_OSS_KEY=xxxx

### 为视频媒姿上传设置 VOD 服务

1. "配置管理/媒资管理配置/存储管理"，设置为"公共读"，进入对应的存储桶，可以讲读写权限设置为："公共读"。否则，需要的对文件访问进行身份认证。

短视频上传要求的系统环境变量设置。此处的 REACT_APP_ALIYUN_VOD_ID 和 REACT_APP_ALIYUN_VOD_KEY 可以和上面的 OSS 相同：

     # ALIYUN VOD - Reference: https://help.aliyun.com/document_detail/101355.html?spm=a2c4g.11186623.6.979.3e8d3aadWOpdmE
     REACT_APP_ALIYUN_ACCOUNT_ID=xxxx
     REACT_APP_ALIYUN_VOD_REGION=cn-shanghai

## 启用和运行

依赖于两个后台服务：

* Account Center 用于用户注册和认证访问
* zdnGraphQL 用于媒资管理

### 设置环境变量

复制本地环境变量 `cp .env.example .env` 根据实际情况设置。

    # ZDN GraphQL Server
    REACT_APP_ZDN_SERVER_BASE=https://<zdbGraphql-internet-host>:<port>
    
    # For Login
    REACT_APP_HEADER_FOR_AUTH=token
    REACT_APP_PASSWORD_RESET_TOKEN_LEN=6
    # invite and reset password token will be expired in INVITE_TOKEN_TTL seconds
    REACT_APP_INVITE_TOKEN_TTL=60
    
    # ALIYUN VOD - Reference: https://help.aliyun.com/document_detail/101355.html?spm=a2c4g.11186623.6.979.3e8d3aadWOpdmE
    REACT_APP_ALIYUN_ACCOUNT_ID=xxxx
    REACT_APP_ALIYUN_VOD_REGION=cn-shanghai
    
    # ALIYUN OSS
    REACT_APP_ALIYUN_OSS_BUCKET=https://xxxx.oss-cn-shanghai.aliyuncs.com
    REACT_APP_ALIYUN_OSS_ID=xxxx
    REACT_APP_ALIYUN_OSS_KEY=xxxx
    
### Run

Run in dev mode

    yarn
    yarn start

Deploy to static web server, 运行 build 命令后，将 build 目录的内容复制到 Web 服务器的 Web-Root 下。
    
    yarn build

## Run with Docker in develop mode
    
    ./docker_builder.sh
    ./docker_run.sh

**Attention** For production mode, please set the ENV of container according your deployment
