// pages/forgetPwd/forgetPwd.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');

Page({
  data: {
    phone: "",
    vercode: "",
    getVerCode: "获取验证码",
    currentTime: 60,
    disabled: false,
    vercodeSrc: "",
    openId: ""
  },
  onLoad: function(){
    let random = new Date().getTime();
    this.setData({
      vercodeSrc: util.ServerConfig.request + "/api/captcha.jpg?t=" + random + "&key=" + util.dataStorage.Get("openid")
    });
    this.setData({
      openId: util.dataStorage.Get("openid")
    });
  },
  changeCode: function(){
    let random = new Date().getTime();
    this.setData({
      vercodeSrc: util.ServerConfig.request + "/captcha.jpg?t=" + random + "&key=" + this.data.openId
    });
  },
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput: function (e) {
    this.setData({
      vercode: e.detail.value
    })
  },
  sendVerCode: function(){
    let phone = this.data.phone;
    if (phone.length < 1) {
      util.showToast("请输入手机号！");
    } else if (!phone.match("^((13[0-9])|(14[0-9])|(15[0|1|2|3|5|6|7|8|9])|(17[0-9])|18[0-9])\\d{8}|(170\\d{8})$")) {
      util.showToast("手机号格式错误！");
    }else{
      this.countDown();
      // sendRequestApi.GetMsgCodeApi(phone).then(res => {
      //   console.log(res);
      // });
    }    
  },
  //60s倒计时
  countDown: function(){
    let currentTime = this.data.currentTime;
    this.setData({
      getVerCode: currentTime + 's',
      disabled: true
    })
    let interval = setInterval(() => {
      this.setData({
        getVerCode: (currentTime - 1) + 's',
        disabled: true
      })

      currentTime--;

      if (currentTime <= 0) {
        clearInterval(interval);

        this.setData({
          getVerCode: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000);
  },
  formSubmit: function () {
    let phone = this.data.phone;
    let vercode = this.data.vercode;
    if (phone.length < 1) {
      util.showToast("请输入手机号！");
    } else if (!phone.match("^((13[0-9])|(14[0-9])|(15[0|1|2|3|5|6|7|8|9])|(17[0-9])|18[0-9])\\d{8}|(170\\d{8})$")){
      util.showToast("手机号格式错误！");
    } else if (vercode < 1) {
      wx.showToast({
        title: "请输入验证码！",
        icon: "none",
        duration: 2000
      });
    }else{
      let data = {
        phone: phone,
        captcha: vercode,
        openId: this.data.openId
      }
      sendRequestApi.findPwdApi(data).then(res => {
        wx.navigateTo({
          url: '/pages/findPwd/findPwd?phone= ' + phone,
        })
      });      
    }
  }
})