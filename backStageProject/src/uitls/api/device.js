// 设备管理
var number = '99999925_'
export default  {
    //设备备案
    DEVICE_FIND:'DEVICE_DEVICE_FIND_REQ_' + number, // 详情
    DEVICE_ADD :'DEVICE_DEVICE_ADD_REQ_' + number,  // 添加保存
    DEVICE_PAGE :'DEVICE_DEVICE_PAGE_REQ_' + number,  // 查询
    DEVICE_DELETE :'DEVICE_DEVICE_DELETE_REQ_' + number,  // 删除
    DEVICE_ASSIGN :'DEVICE_DEVICE_ASSIGN_REQ_' + number,  // 删除
    DEVICE_IMPORT :'DEVICE_DEVICE_IMPORT_REQ_' + number,  // 批量导入 保存
    COMPANY_LIST :'DEVICE_COMPANY_LIST_REQ_' + number,  // 获取厂商

    // 设备部署
    BIND_RELEASE :'DEVICE_BIND_RELEASE_REQ_' + number, // 解除绑定
    PAGE_STATION :'DEVICE_PAGE_STATION_REQ_' + number, // 联动 省份
    PAGE_PLAZA :'DEVICE_PAGE_PLAZA_REQ_' + number, // 收费车站
    PAGE_LANE :'DEVICE_PAGE_LANE_REQ_' + number, // 收费广场
    BIND_FIND:'DEVICE_BIND_FIND_REQ_' + number, // 详情
    BIND_ADD:'DEVICE_BIND_ADD_REQ_' + number, // 部署功能保存
    BIND_DELETE:'DEVICE_BIND_DELETE_REQ_' + number, // 解绑
    BIND_CONFIRM:'DEVICE_BIND_CONFIRM_REQ_' + number, // 添加保存
    BIND_RELEASES:'DEVICE_BIND_RELEASE_REQ_' + number, // 释放
    AGENCY_FIND:'DEVICE_AGENCY_FIND_REQ_' + number, // 是否有代收关系


   // 地址管理
    ADDRESS_PAGE:'DEVICE_ADDRESS_PAGE_REQ_' + number, // 查询
    ADDRESS_FIND:'DEVICE_ADDRESS_FIND_REQ_' + number, // 详情
    ADDRESS_ADD:'DEVICE_ADDRESS_ADD_REQ_' + number, // 添加
    ADDRESS_UPDATE:'DEVICE_ADDRESS_UPDATE_REQ_' + number, //更新
    // 地址配置
    ADDRESS_BINDPAGE:'DEVICE_ADDRESS_BINDPAGE_REQ_' + number, // 查询
    BIND_PAGE:'DEVICE_BIND_PAGE_REQ_' + number, // 查询 设备
    ADDRESS_BIND:'DEVICE_ADDRESS_BIND_REQ_' + number, // 查询 设备
    ADDRESS_UNBIND:'DEVICE_ADDRESS_UNBIND_REQ_' + number, // 解绑
    // APP软件管理
    APP_UPLOAD:'DEVICE_APP_UPLOAD_REQ_' + number, // 上传保存功能
    APP_PAGE:'DEVICE_APP_PAGE_REQ_' + number, // 查询
    //SDK 管理
    SDK_PAGE:'DEVICE_SDK_PAGE_REQ_' + number, // 查询
}
