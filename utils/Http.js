const util = require('./util.js');
let DaiQianBaoHttp = function(url, params = {}, method = "GET") {
  let token = util.dataStorage.Get("token") || "";

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      header: {
        "token": token
      },
      method: method,
      success: res => {
        if (res.data.code == 401 || res.data.code == 402 || res.data.code == 403){
          wx.navigateTo({
            url: "/pages/login/login"
          })
        }else{
          resolve(res);
        }        
      },
      fail: error => {
        reject(error);
      }
    });
  });  
}

module.exports = DaiQianBaoHttp