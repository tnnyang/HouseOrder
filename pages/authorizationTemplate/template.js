// pages/shouquanTemplate/template.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');

Page({
  data: {
    email: "",
    flag: false
  },
  emailInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  formSubmit: function () {
    let email = this.data.email;
    if (email.length == 0) {
      util.showToast("邮箱不能为空！");
    } else if (!email.match(/[a-zA-Z0-9]{1,10}@[a-zA-Z0-9]{1,20}\.[a-zA-Z0-9]{1,5}/)) {
      util.showToast("邮箱格式不正确！");      
    }else{
      let data = {
        email: this.data.email
      }

      if (!this.data.flag) {
        this.setData({
          flag: true
        });
        
        sendRequestApi.AddAuthorizationModelApi(data).then(res => {
          if (res.data.code == 0) {
            this.setData({
              flag: false
            });

            util.showToast(res.data.msg);
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 2500);      
          }
        });
      }
    }
  }
})