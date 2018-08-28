// pages/shouQuanDetail/detail.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');

Page({
  data: {
    isShowPage: false,
    remarks: "",
    imgPath: util.ServerConfig.resource + "/file/preview.ashx?GUID=",
    infoId: ""
  },
  remarksInput: function (e) {
    this.setData({
      remarks: e.detail.value
    })
  },
  onLoad: function (opts) {
    let params = {
      infoId: opts.infoId
    }

    this.setData({
      infoId: opts.infoId
    });

    wx.showNavigationBarLoading();

    sendRequestApi.getAuthorizationDetailApi(params).then(res => {
      if (res.data.code == 0) {
        this.setData({
          isShowPage: true,
          imgPath: this.data.imgPath + res.data.data.authorizationEntity.url
        });

        wx.hideNavigationBarLoading();
      }
    });
  },
  addAuthorizationDetailSave: function(){
    let remarks = this.data.remarks;
    if (remarks.length == 0) {
      util.showToast("备注不能为空！");
    } else {
      let params = {
        id: this.data.infoId,
        remark: remarks
      }
      sendRequestApi.AddAuthorizationDetailSaveApi(params).then(res => {
        if(res.data.code == 0){
          util.showToast("保存成功！");
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2500);
        }        
      });
    }
  }
})