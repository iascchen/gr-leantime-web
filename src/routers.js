import Home from './components/common/Home'

import Login from './modules/login/Login'
import Logout from './modules/login/Logout'
import SignUpPW from './modules/login/SignUpPW'
import ResetPW from './modules/login/ResetPW'

import VideoList from './modules/video/VideoList'
import VideoEdit from './modules/video/VideoEdit'

import PlaylistList from './modules/playlist/PlaylistList'
import PlaylistEdit from './modules/playlist/PlaylistEdit'

import BloggerList from './modules/blogger/BloggerList'
import BloggerEdit from './modules/blogger/BloggerEdit'
import MyBloggerEdit from './modules/myBlogger/MyBloggerEdit'

import LeveledLabelList from './modules/leveledLabel/LeveledLabelList'
import LeveledLabelEdit from './modules/leveledLabel/LeveledLabelEdit'

import WeappTabList from './modules/weappTab/WeappTabList'
import WeappTabEdit from './modules/weappTab/WeappTabEdit'

import RecommendSysParamsEdit from './modules/sysParam/RecommendSysParamsEdit'

import RecommendVideoList from './modules/recommend/RecommendVideoList'
import RecommendVideoEdit from './modules/recommend/RecommendVideoEdit'

import AliyunVodPanel from './modules/aliyunVod/AliyunVodPanel'

import JeelizPanel from './modules/sandbox/JeelizPanel'

import PrompterList from './modules/prompter/PrompterList'
import PrompterEdit from './modules/prompter/PrompterEdit'
import MyPrompterEdit from './modules/myPrompter/MyPrompterEdit'
import PromptTaskEdit from './modules/promptTask/PromptTaskEdit'
import PromptTaskList from './modules/promptTask/PromptTaskList'

// import CategoryIndex from './modules/category'
// import CategoryEditWidget from './modules/category/EditWidget'

const routes = [
    { path: '/', exact: true, component: Home },

    { path: '/login', component: Login },
    { path: '/logout', component: Logout },
    { path: '/signup', component: SignUpPW },
    { path: '/resetpw', component: ResetPW },

    { path: '/videos', exact: true, component: VideoList },
    { path: '/videos/new', exact: true, component: VideoEdit },
    { path: '/videos/:id', component: VideoEdit },

    { path: '/playlists', exact: true, component: PlaylistList },
    { path: '/playlists/new', exact: true, component: PlaylistEdit },
    { path: '/playlists/:id', component: PlaylistEdit },

    { path: '/bloggers', exact: true, component: BloggerList },
    { path: '/bloggers/new', exact: true, component: BloggerEdit },
    { path: '/bloggers/:id', component: BloggerEdit },

    { path: '/mybloggers', exact: true, component: MyBloggerEdit },

    { path: '/myprompts', exact: true, component: PromptTaskList },
    { path: '/prompts/new', exact: true, component: PromptTaskEdit },
    { path: '/prompts/:id', component: PromptTaskEdit },

    { path: '/prompters', exact: true, component: PrompterList },
    { path: '/prompters/new', exact: true, component: PrompterEdit },
    { path: '/prompters/:id', component: PrompterEdit },

    { path: '/myprompters', exact: true, component: MyPrompterEdit },

    { path: '/weapptabs', exact: true, component: WeappTabList },
    { path: '/weapptabs/new', exact: true, component: WeappTabEdit },
    { path: '/weapptabs/:id', exact: true, component: WeappTabEdit },
    { path: '/weapptabs/:id/new', component: WeappTabEdit },

    { path: '/labels', exact: true, component: LeveledLabelList },
    { path: '/labels/new', exact: true, component: LeveledLabelEdit },
    { path: '/labels/:id', exact: true, component: LeveledLabelEdit },
    { path: '/labels/:id/new', component: LeveledLabelEdit },

    { path: '/recommend/defaults', exact: true, component: RecommendSysParamsEdit },

    { path: '/recommend/hot', exact: true, component: RecommendVideoList },
    { path: '/recommend/hot/new', exact: true, component: RecommendVideoEdit },
    { path: '/recommend/hot/:videoId', component: RecommendVideoEdit },

    { path: '/aliyunVod', component: AliyunVodPanel },
    { path: '/weboji', component: JeelizPanel },

    { path: '*', component: Home }
]

export default routes
