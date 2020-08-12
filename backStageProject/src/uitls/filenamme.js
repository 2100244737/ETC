const api1 = '99999925_';


 const loginfile = 'DEVICE_USER_LOGIN_REQ_99999925_'; // 登录
 const getCodefile = 'DEVICE_USER_CODE_REQ_99999925_'; // 获取code
 // 退出
 const USER_LOGOUT = 'DEVICE_USER_LOGOUT_REQ_99999925_'
 // 用户管理
 const SSO_FIND = 'DEVICE_SSO_FIND_REQ_99999925_'; // 同步查询
 const SSO_ADD = 'DEVICE_USER_ADD_REQ_99999925_'; // 同步保存
 const USER_PAGE = 'DEVICE_USER_PAGE_REQ_99999925_'; // 同步保存
 //  系统管理-查询日志
 const SYSTEM_LOG = 'DEVICE_SYSTEM_LOG_REQ_99999925_'; // 查询日志
 // 设备备案
 const getEquipmentFile = 'DEVICE_DEVICE_FIND_REQ_99999925_' // 详情
const addEquipmentDevice = 'DEVICE_DEVICE_ADD_REQ_99999925_' // 添加
const DEVICE_PAGE = 'DEVICE_DEVICE_PAGE_REQ_99999925_' // 添加
const DEVICE_IMPORT = 'DEVICE_DEVICE_IMPORT_REQ_99999925_' // 批量导入
// 设备部署
const PAGE_STATION ='DEVICE_PAGE_STATION_REQ_99999925_'; // 联动 省份
const PAGE_LANE ='DEVICE_PAGE_LANE_REQ_99999925_'; // 收费广场
const PAGE_PLAZA ='DEVICE_PAGE_PLAZA_REQ_99999925_';   // 收费车站
const BIND_FIND ='DEVICE_BIND_FIND_REQ_99999925_';   // 详情
const BIND_ADD ='DEVICE_BIND_ADD_REQ_99999925_';    // 部署功能保存
const BIND_DELETE ='DEVICE_BIND_DELETE_REQ_99999925_';    // 停用
const BIND_RELEASES ='DEVICE_BIND_RELEASE_REQ_99999925_';    // 释放
const BIND_CONFIRM ='DEVICE_BIND_CONFIRM_REQ_99999925_';      // 添加保存
const BIND_PAGE ='DEVICE_BIND_PAGE_REQ_99999925_';      // 查询
const BIND_RELEASE ='DEVICE_BIND_RELEASE_REQ_99999925_';      // 解除绑定
// 统计查询
 const STAT_COMPUTE ='DEVICE_STAT_COMPUTE_REQ_99999925_';      // 接口调用


 export {
     STAT_COMPUTE,
     SYSTEM_LOG,
     BIND_RELEASE,
     BIND_RELEASES,
     USER_LOGOUT,
     SSO_FIND,
     SSO_ADD,
     USER_PAGE,
     loginfile,
     getCodefile,
     getEquipmentFile,
     addEquipmentDevice,
     DEVICE_PAGE,
     PAGE_STATION,
     PAGE_LANE,
     DEVICE_IMPORT,
     PAGE_PLAZA,
     BIND_FIND,
     BIND_ADD,
     BIND_DELETE,
     BIND_CONFIRM,
     BIND_PAGE
 }
