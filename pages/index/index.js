// pages/starTPage/starTPage.js
const util = require('../../utils/util.js');

Page({
  data: {
    isShowPFMenu: true,
    isShowSQMenu: true
  },
  // onLoad: function(){
  //   // this.isLogin();
  // },
  onShow: function(){
    this.isLogin();
  },
  isLogin: () => {
    if (!util.dataStorage.Get("token")) {
      setTimeout(() => {
        wx.navigateTo({
          url: "/pages/login/login"
        })
      }, 1500)
    }
  },
  pingFangTab: function () {
    this.setData({
      isShowPFMenu: !this.data.isShowPFMenu,
      isShowSQMenu: true
    });
  },
  authorizatioTab: function () {
    this.setData({
      isShowPFMenu: true,
      isShowSQMenu: !this.data.isShowSQMenu
    });
  }
})