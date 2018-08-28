let apiConfig = {
  //登录API
  LoginApi:{
    pathWxLogin: "/api/wechat/wxQRLoginByQudao",
    pathLogin: "/api/wxLogin",    
    pathFindPwd: "/api/retrievePassword",
    pathGetPhoneCode: "/api/getPwdBackCode"
  },
  //评房API
  PingFangApi: {
    pathGetList: "/api/order/info/wxList",
    pathGetDetail: "/api/channel/getOrderInfo",
    pathAddPingFang: "/api/outChannel/houseCommit",
    pathPingFangConfirm: "/api/channel/queRenJiaGe",
    pathPingFangFuYi: "/api/channel/orderFuYi",
    pathPingFangAbandon: "/api/channel/orderFangQi",
    pathDeedDistinguish: "/api/channel/checkPOC",
    pathDeleteDeed: "/file/delete.ashx",
    pathCheckPingFang: "/api/channel/checkRepeatOrder",
    pathGetNature: "/api/order/info/getConfigListByValue"
  },
  //授权API
  AuthorizationApi: {
    pathGetList: "/api/Authorization/info/page",
    pathGetDetail: "/api/Authorization/info/info",
    pathAddAuthorization: "/api/Authorization/info/uploadPic",
    pathAddAuthorizationModel: "/api/Authorization/info/sendInfoModel",
    pathAddAuthorizationDetailSave: "/api/Authorization/info/updateRemark",
    pathGrantAuthorization: "/api/Authorization/info/grantAuthorization"
  }
}

module.exports = apiConfig