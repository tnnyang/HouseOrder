const util = require('./utils/util.js');
util.ServerConfigInt();
const sendRequestApi = require('./api/sendRequestApi.js');

//app.js
App({
  onLaunch: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        sendRequestApi.WxAutoLoginApi(res.code).then(res => {
          if(res != null && res != "" && res.data != null){
            util.dataStorage.Save("openid", res.data.openid);
            
            if (res.data.code == 0) {
              util.dataStorage.Save("token", res.data.data.token);
            }else{
              wx.navigateTo({
                url: "/pages/login/login"
              })
            }
          }else{
            wx.navigateTo({
              url: "/pages/index/index"
            })
          }          
        });
      }
    })
  }
})