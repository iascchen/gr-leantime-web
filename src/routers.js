import Home from './components/common/Home'

import Login from './modules/login/Login'
import Logout from './modules/login/Logout'
import SignUpPW from './modules/login/SignUpPW'
import ResetPW from './modules/login/ResetPW'

import BloggerList from './modules/blogger/BloggerList'
import BloggerEdit from './modules/blogger/BloggerEdit'
import MyBloggerEdit from './modules/myBlogger/MyBloggerEdit'

import LeveledLabelList from './modules/leveledLabel/LeveledLabelList'
import LeveledLabelEdit from './modules/leveledLabel/LeveledLabelEdit'

import WeappTabList from './modules/weappTab/WeappTabList'
import WeappTabEdit from './modules/weappTab/WeappTabEdit'

import RecommendSysParamsEdit from './modules/sysParam/RecommendSysParamsEdit'

import JeelizPanel from './modules/sandbox/JeelizPanel'

import PrompterList from './modules/prompter/PrompterList'
import PrompterEdit from './modules/prompter/PrompterEdit'
import MyPrompterEdit from './modules/myPrompter/MyPrompterEdit'

import TenantList from './modules/tenant/TenantList'
import TenantEdit from './modules/tenant/TenantEdit'

// import CategoryIndex from './modules/category'
// import CategoryEditWidget from './modules/category/EditWidget'

const routes = [
    { path: '/', exact: true, component: Home },

    { path: '/login', component: Login },
    { path: '/logout', component: Logout },
    { path: '/signup', component: SignUpPW },
    { path: '/resetpw', component: ResetPW },

    { path: '/tenants', exact: true, component: TenantList },
    { path: '/tenants/new', exact: true, component: TenantEdit },
    { path: '/tenants/:id', component: TenantEdit },

    { path: '/bloggers', exact: true, component: BloggerList },
    { path: '/bloggers/new', exact: true, component: BloggerEdit },
    { path: '/bloggers/:id', component: BloggerEdit },

    { path: '/mybloggers', exact: true, component: MyBloggerEdit },

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

    { path: '/weboji', component: JeelizPanel },

    { path: '*', component: Home }
]

export default routes
