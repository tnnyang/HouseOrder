// pages/search/search.js
const util = require('../../utils/util.js');
Page({
  data: {
    pingFangValue: "",
    AuthorizationValue: "",
    isFocus: true,
    isPingFang: true
  },
  onLoad: function(opts){
    if (opts.searchType != "pingfang"){
      this.setData({
        isPingFang: false
      });
      
      wx.setNavigationBarTitle({
        title: "授权书搜索"
      });
    }
  },
  searchPingFangInput:function(e){
    this.setData({
      pingFangValue: e.detail.value
    });
  },
  searchAuthorizationInput: function(e){
    this.setData({
      AuthorizationValue: e.detail.value
    });
  },
  searchPingFang: function(){
    let pingFangValue = this.data.pingFangValue;
    if (pingFangValue.length < 1){
      util.showToast("请输入房屋关键信息！")
    }else{
      wx.navigateTo({
        url: "/pages/reviewList/reviewList?keyWord=" + pingFangValue + "&page=1&limit=10",
      })
    }    
  },
  searchAuthorization: function(){
    let AuthorizationValue = this.data.AuthorizationValue;
    if (AuthorizationValue.length < 1) {
      util.showToast("请输入授权人或身份证关键信息!")
    } else {
      wx.navigateTo({
        url: "/pages/authorization/authorization?keyWord=" + AuthorizationValue + "&page=1&limit=10",
      })
    }
  }
})