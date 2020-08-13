import Vue from 'vue'
import Router from 'vue-router'
//  首页
import index from '@/pages/index'
//  登录页
import login from '../pages/loginindex'
//  home页
import home from "@/pages/home";

// +--------------------------------------------------------
//路径查询
import pathQuery from '../pages/queryPath/pathQuery'
// 系统管理
// 系统管理-  角色管理
import roleManagement from "@/pages/system/roleManagement"
// 系统管理- 用户管理
import userManagement from "@/pages/system/userManagement"
// 系统管理 - 查询日志
import logQuery from "../pages/system/logQuery";

// 设备管理
// 设备备案
import equipment from "../pages/deviceManager/equipment";
// 设备部署
import equipmentDeploy from "../pages/deviceManager/equipmentDeploy";
// 测试
import dome from '../pages/dome'

Vue.use(Router);

const routers = new Router({
    routes: [

        {path: '/', redirect: '/login', hidden: true},
        // {
        //     path: '/qqmap',
        //     name: '/qqmap',
        //     meta: {title: '腾讯地图'},
        //     component: () => import('../pages/queryPath/qqmap'),
        // },
        {path: '/login', name: 'login', component: login, hidden: true},
        // {path: '/', redirect: '/demo', hidden: true},
        {path: '/demo', name: 'demo', component: dome, hidden: true},
        {
            path: '/index', meta: {title: '首页'}, component: index,
            children: [
                {
                    path: '/index', name: 'index', meta: {
                        title: '首页',
                        url: '/index'
                    }, component: home,
                },
            ]
        },
        {
            path: '/system',
            name: 'system',
            meta: {title: '系统管理'},
            redirect: '/system/roleManagement',
            component: index,
            children: [
                {path: 'roleManagement', name: 'roleManagement', meta: {title: '角色管理'}, component: roleManagement,},
                {path: 'userManagement', name: 'userManagement', meta: {title: '用户管理'}, component: userManagement,},
                {path: 'menuManagement', name: 'menuManagement', meta: {title: '菜单管理'}, component: () => import('../pages/system/menuManagement'),},

                {path: 'logQuery', name: 'logQuery', meta: {title: '查询日志'}, component: logQuery,},
            ]
        },
        {
            path: '/queryPath', name: 'queryPath', meta: {title: '计费日志'},
            component: index,
            children: [{
                path: 'pathQuery', name: 'pathQuery', meta: {title: '车道日志查询'}, component: pathQuery,
            }, {
                path: 'TerminalLog',
                name: 'TerminalLog',
                meta: {title: '终端日志查询'},
                component: () => import('../pages/queryPath/ipadQuery'),
            },
               ]
        },
        {
            path: '/unitManger',
            name: 'unitManger',
            meta: {title: '单位管理'},
            component: index,
            children: [
                {
                    path: 'unitMember',
                    name: 'unitMember',
                    meta: {title: '单位成员管理'},
                    component: () => import('../pages/unitManger/unitMember'),
                },
                {
                    path: 'unitAccount',
                    name: 'unitAccount',
                    meta: {title: '单位账户管理'},
                    component: () => import('../pages/unitManger/unitAccount'),
                },
            ]
        },
        {
            path: '/deviceManager', name: 'deviceManager', meta: {title: '设备管理'},
            component: index,
            children: [
                {path: 'equipment', name: 'equipment', meta: {title: '设备备案'}, component: equipment,},
                {path: 'equipmentDeploy', name: 'equipmentDeploy', meta: {title: '设备部署'}, component: equipmentDeploy,},
                {path: 'siteAdministration', name: 'siteAdministration', meta: {title: '地址管理'}, component: ()=> import('../pages/deviceManager/siteAdministration'),},
                {path: 'siteConfiguration', name: 'siteConfiguration', meta: {title: '地址配置'}, component: ()=> import('../pages/deviceManager/siteConfiguration'),},
                {path: 'appManage', name: 'appManage', meta: {title: 'APP软件管理'}, component: ()=> import('../pages/deviceManager/appManage'),},
                {path: 'SDKManage', name: 'SDKManage', meta: {title: 'SDK管理'}, component: () => import('../pages/deviceManager/SDKManage'),},
            ]
        },
        {
            path: '/agency',
            name:'agency',
            component: index,
            children: [
                {
                    path: 'agencyManage',
                    name: 'agencyManage',
                    meta: {title: '代收关系维护'},
                    component: () => import('../pages/agency/collectionRelation'),
                },
            ]
        },
        {
            path: '/statisticalQuery', name: 'statisticalQuery', meta: {title: '统计分析'},
            component: index,
            children: [
                {
                    path: 'Interface',
                    name: 'Interface',
                    meta: {title: '车道调用统计'},
                    component: () => import('../pages/statisticalQuery/Interface'),
                },
            ]
        },
        {
            path: '/calc', name: 'calc', meta: {title: '计费数据'},
            component: index,
            children: [
                {
                    path: 'BillingNode',
                    name: 'BillingNode',
                    meta: {title: '计费相邻节点'},
                    component: () => import('../pages/calc/BillingNode'),
                },
                {
                    path: 'BillingNodeDetail',
                    name: 'BillingNodeDetail',
                    meta: {title: '计费节点详情'},
                    component: () => import('../pages/calc/BillingNodeDetail'),
                },
                {
                    path: 'entityGantry',
                    name: 'entityGantry',
                    meta: {title: '计费实体门架'},
                    component: () => import('../pages/calc/entityGantry'),
                },
                {
                    path: 'TollBoothAgent',
                    name: 'TollBoothAgent',
                    meta: {title: '计费代收关系'},
                    component: () => import('../pages/calc/TollBoothAgent'),
                },
            ]
        },
        {
            path: '/basicData', name: 'basicData', meta: {title: '基础数据'},
            component: index,
            children: [
                {
                    path: 'tollStation',
                    name: 'tollStation',
                    meta: {title: '全量收费站查询'},
                    component: () => import('../pages/basicData/tollStation'),
                },
                {
                    path: 'tolPllaza',
                    name: 'tolPllaza',
                    meta: {title: '全量收费广场查询'},
                    component: () => import('../pages/basicData/tolPllaza'),
                },
                {
                    path: 'portal',
                    name: 'portal',
                    meta: {title: '全量门架查询'},
                    component: () => import('../pages/basicData/portal'),
                },

                {
                    path: 'TollLane',
                    name: 'TollLane',
                    meta: {title: '收费车道查询'},
                    component: () => import('../pages/basicData/TollLane'),
                },
            ]
        }
    ]
})
export default routers
