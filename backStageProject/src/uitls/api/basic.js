// 基础数据接口
var number = '99999925_'
export default  {
    STATION :'DEVICE_BASIC_STATION_REQ_' + number, // 收费站
    PLAZA:'DEVICE_BASIC_PLAZA_REQ_' + number, // 收费广场
    LANE:'DEVICE_BASIC_LANE_REQ_' + number, // 收费车道
    GANTRY:'DEVICE_BASIC_GANTRY_REQ_' + number, // 全量门架
    NODE:'DEVICE_BASIC_NODE_REQ_' + number, //  计费相邻节点
    INFO:'DEVICE_BASIC_INFO_REQ_' + number, //  计费节点详情
    SOLID:'DEVICE_BASIC_SOLID_REQ_' + number, //  实体门架
    AGENCY:'DEVICE_BASIC_AGENCY_REQ_' + number, //  收费站代理
    //  代收关系
    AGENCY_PAGE:'DEVICE_AGENCY_PAGE_REQ_' + number, //查询
    AGENCY_ADD:'DEVICE_AGENCY_ADD_REQ_' + number, //  代收关系添加
    PAGE_PLAZA:'DEVICE_PAGE_PLAZA_REQ_' + number, //  获取收费广场
    PAGE_STATION:'DEVICE_PAGE_STATION_REQ_' + number, //  获取收费站
    AGENCY_DELETE:'DEVICE_AGENCY_DELETE_REQ_' + number, //  删除
    AGENCY_UPDATE:'DEVICE_AGENCY_UPDATE_REQ_' + number, // 修改
    // 单位账户管理
    SSO_FIND:'DEVICE_SSO_FIND_REQ_' + number, // 查询SSo
    COMPANY_ADD:'DEVICE_COMPANY_ADD_REQ_' + number, // 添加保存
    COMPANY_PAGE:'DEVICE_COMPANY_PAGE_REQ_' + number, // 查询
    COMPANY_UPDATE:'DEVICE_COMPANY_UPDATE_REQ_' + number, // 修改
    COMPANY_STATUS:'DEVICE_COMPANY_STATUS_REQ_' + number, // 移除
    COMPANY_MANAGER:'DEVICE_COMPANY_MANAGER_REQ_' + number, // 修改管理员
   // 单位成员管理
    COMPANYUSER_ADD:'DEVICE_COMPANYUSER_ADD_REQ_' + number, // 添加保存
    COMPANYUSER_ROLE:'DEVICE_COMPANYUSER_ROLE_REQ_' + number, // 查询角色
    COMPANYUSER_PAGE:'DEVICE_COMPANYUSER_PAGE_REQ_' + number, // 查询
    COMPANYUSER_UPDAT:'DEVICE_COMPANYUSER_UPDATE_REQ_' + number, // 修改
    COMPANYUSER_DELETE:'DEVICE_COMPANYUSER_DELETE_REQ_' + number, // 修改
}
