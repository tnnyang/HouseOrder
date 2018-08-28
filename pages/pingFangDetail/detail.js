// pages/pingFangDetail/detail.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');

Page({
  data: {
    isShowPage: false,
    orderInfo: {},
    houseList:[],
    assessDate: "",
    managerName: "",
    orderId: "",
    containerBottom: 0,
    imgPath: util.ServerConfig.resource + "/file/preview.ashx?GUID="
  },
  onLoad: function(opts){
    let params = {
      orderId: opts.orderId,
    }

    util.dataStorage.Save("pingFangOrderId", opts.orderId);
    util.dataStorage.Save("pingFangPerson", opts.person);

    this.setData({
      orderId: opts.orderId,
      managerName: opts.person
    });

    wx.showNavigationBarLoading();

    sendRequestApi.getPingFangDetailApi(params).then(res => {
      if (res.data.code == 0) {
        let {data: {houseList, orderInfo}} = res;
        let date = util.formatTime(new Date(orderInfo.createTime));
        if (orderInfo.orderState == "house_confirm" || orderInfo.orderState == "house_fail" || orderInfo.orderState == "house_outtime"){
          this.setData({
            containerBottom: "186rpx"
          })
        }

        this.setData({
          isShowPage: true,
          orderInfo: orderInfo,
          houseList: houseList,
          assessDate: date         
        });

        wx.hideNavigationBarLoading();
      }
    });
  },
  //评房确认
  confirm: function(){
    let params = { orderId: this.data.orderInfo.id }
    sendRequestApi.PingFangConfirmApi(params).then(res => { 
      if(res.data.code == 0){
        util.showToast("确认成功！");
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/pingFangDetail/detail?orderId=' + util.dataStorage.Get("pingFangOrderId") + '&person=' + util.dataStorage.Get("pingFangPerson")
          })
        }, 2500);
      }      
    })
  },
  //评房复议
  reconsideration: function () {
    wx.navigateTo({
      url: '/pages/fuyi/fuyi?orderId=' + this.data.orderId + '&person=' + this.data.managerName
    })
  },
  //评房放弃
  cancel: function () {
    let params = {
      orderId: this.data.orderInfo.id,
      orderState: this.data.orderInfo.orderState
    }

    sendRequestApi.PingFangAbandonApi(params).then(res => {
      if(res.data.code == 0){
        util.showToast(res.data.msg);
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/pingFangDetail/detail?orderId=' + util.dataStorage.Get("pingFangOrderId") + '&person=' + util.dataStorage.Get("pingFangPerson")
          })
        }, 2500)
      } else if (res.data.code == 500){
        util.showToast(res.data.msg);
      }
    })
  },
  setClipboardData: function(e) {
    var data = "订单号：" + e.currentTarget.dataset.orderno;
    wx.setClipboardData({
      data: data,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data            
          }
        })
      }
    })
  },
  //再次评估
  againAssess: function(){
    wx.navigateTo({
      url: '/pages/againPingFang/againPingFang?orderId=' + this.data.orderId
    })
  }
})