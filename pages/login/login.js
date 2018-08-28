// pages/login/login.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');

Page({
  data: {
    userName: "",
    pwd: "",
    isShowCancel: false,
    dialogContent: ""
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  //取消事件
  _cancelEvent() {
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    this.dialog.hideDialog();
  },
  userInput: function(e){
    this.setData({
      userName: e.detail.value
    })
  },
  pwdInput: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  formSubmit: function () {
    if (this.data.userName.length == 0 || this.data.pwd.length == 0) {
      wx.showToast({
        title: "用户名或密码不能为空！",
        icon: "none",  
        duration: 2000
      });
    }else{
      let data = {
        "userName": this.data.userName,
        "passWord": this.data.pwd,
        "openid": util.dataStorage.Get("openid")
      }

      sendRequestApi.loginApi(data).then(res => {
        if(res.data.code == 500){
          this.setData({
            dialogContent: res.data.msg
          })
          this.dialog.showDialog();
        }else{
          util.dataStorage.Save("token", res.data.data.token);
          wx.navigateTo({
            url: "/pages/reviewList/reviewList"
          })
        }      
      });      
    }
  }
})