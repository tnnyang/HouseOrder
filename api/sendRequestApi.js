const util = require('../utils/util.js');
const Http = require('../utils/Http.js');
const config = require('./config.js');

let sendRequestApi = {
  //微信自动登录
  WxAutoLoginApi: function (data) {
    let url = util.ServerConfig.request + config.LoginApi.pathWxLogin + "?code="+  data;
    return new Promise((resolve, reject) => {
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //登录
  loginApi: function (data){
    let url = util.ServerConfig.request + config.LoginApi.pathLogin;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //获取短信验证码
  GetMsgCodeApi: function (data) {
    let url = util.ServerConfig.request + config.LoginApi.pathGetPhoneCode+"?phoneNo=" + data;
    return new Promise((resolve, reject) => {
      Http(url).then(res => {
        resolve(res);
      })
    })
  },
  //找回密码
  findPwdApi: function (data){
    let url = util.ServerConfig.request + config.LoginApi.pathFindPwd + "?phoneNo=" + data.phone + "&captcha=" + data.captcha + "&openid=" + data.openId;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //评房列表
  getPingFangListApi: function (data){
    let url = "";
    if (data.keywords){
      url = util.ServerConfig.request + config.PingFangApi.pathGetList + "?keyWord=" + data.keywords + "&page=" + data.pageIndex + "&limit=" + data.pageSize;
    }else{
      url = util.ServerConfig.request + config.PingFangApi.pathGetList + "?page=" + data.pageIndex + "&limit=" + data.pageSize;
    }

    return new Promise((resolve, reject) => {
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //评房详情
  getPingFangDetailApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathGetDetail + "?orderId=" + data.id;
    return new Promise((resolve, reject) => {
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //增加评房
  addPingFangApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathAddPingFang;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //检查评房重复订单
  CheckPingFangApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathCheckPingFang;    
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //评房确认
  PingFangConfirmApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathPingFangConfirm;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //评房复议
  PingFangFuYiApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathPingFangFuYi;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //评房放弃
  PingFangAbandonApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathPingFangAbandon;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //获取房产性质
  getHouseNatureApi: function(data){
    let url = util.ServerConfig.request + config.PingFangApi.pathGetNature;
    return new Promise((resolve, reject) => {
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //授权列表
  getAuthorizationListApi: function (data) {
    let url = "";
    if (data.keywords) {
      url = util.ServerConfig.request + config.AuthorizationApi.pathGetList + "?keyWord=" + data.keywords + "&page=" + data.pageIndex + "&limit=" + data.pageSize;
    }else{
      url = util.ServerConfig.request + config.AuthorizationApi.pathGetList + "?page=" + data.pageIndex + "&limit=" + data.pageSize;
    }
    
    return new Promise((resolve, reject) => {      
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //授权详情
  getAuthorizationDetailApi: function (data) {
    let url = util.ServerConfig.request + config.AuthorizationApi.pathGetDetail + "?InfoId=" + data.infoId;
    return new Promise((resolve, reject) => {
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //增加授权
  addAuthorizationApi: function (data) {
    let url = util.ServerConfig.request + config.AuthorizationApi.pathAddAuthorization;
    return new Promise((resolve, reject) => {
      Http(url, data).then(res => {
        resolve(res);
      })
    })
  },
  //授权模板
  AddAuthorizationModelApi: function (data) {
    let url = util.ServerConfig.request + config.AuthorizationApi.pathAddAuthorizationModel + "?email=" + data.email;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //授权书详情保存
  AddAuthorizationDetailSaveApi: function (data) {
    let url = util.ServerConfig.request + config.AuthorizationApi.pathAddAuthorizationDetailSave;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //扫描授权书
  GrantAuthorizationApi: function (data) {
    let url = util.ServerConfig.request + config.AuthorizationApi.pathGrantAuthorization;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //房产证识别
  deedDistinguishApi: function (data) {
    let url = util.ServerConfig.request + config.PingFangApi.pathDeedDistinguish;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  },
  //删除房产证
  deleteDeedApi: function(data){
    let url = util.ServerConfig.resource + config.PingFangApi.pathDeleteDeed + "?GUID=" + data;
    return new Promise((resolve, reject) => {
      Http(url, data, "POST").then(res => {
        resolve(res);
      })
    })
  }
}

module.exports = sendRequestApi