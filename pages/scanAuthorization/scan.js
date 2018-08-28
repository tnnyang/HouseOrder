// pages/scanAuthorization/scan.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');

Page({
  data: {
    isShowImg: true,
    isShow: false,
    src: "",
    imgPath: util.ServerConfig.resource + "/file/download.ashx?GUID=",
    limit: 0
  },
  onLoad() {
    this.ctx = wx.createCameraContext();

    setTimeout(() => {
      this.setData({
        isShow: true
      });
    }, 3000);

    // let imgPath = "http://testfile.91zhaiquan.net:31102/file/download.ashx?GUID=a3799cd0-ccbb-4bb6-b2b8-be4357ccea93";

    // let params = {
    //   url: imgPath,
    //   limit: this.data.limit
    // }

    // sendRequestApi.GrantAuthorizationApi(params).then(res => {
    //   console.log(res);
    //   if (res != null || res != "") {
    //     wx.hideLoading();
    //     if (res.data.code == 0) {
    //       util.showToast("扫描成功！");
    //       setTimeout(() => {
    //         wx.navigateBack({
    //           delta: 1
    //         })
    //       });
    //     } else if (res.data.code == 12) {
    //       util.showToast("扫描失败！");
    //     }
    //   }
    // })



  },
  takePhoto() {
    this.ctx.takePhoto({
      quality: 'high',
      success: res => {        
        this.setData({
          isShowImg: false,
          src: res.tempImagePath
        });

        this.upLoadPhoto(res.tempImagePath);
      }
    })    
  },
  errorMsg(e) {
    console.log(e.detail)
  },
  upLoadPhoto: function(uploadImgPath){    
    let url = util.ServerConfig.resource + "/file/upload.ashx?UploadUser=1111";

    wx.showLoading({
      title: "正在扫描",
      mask: true
    });

    wx.uploadFile({
      url: url,
      filePath: uploadImgPath,
      name: 'file',
      header: {
        'content-type': 'multipart/form-data'
      },
      success: res => {
        let imgPath = this.data.imgPath + JSON.parse(res.data)[0].fileGUID;
        // let imgPath = "http://testfile.91zhaiquan.net:31102/file/download.ashx?GUID=a3799cd0-ccbb-4bb6-b2b8-be4357ccea93";

        let params = {
          url: imgPath,
          limit: this.data.limit
        }

        sendRequestApi.GrantAuthorizationApi(params).then(res => {
          console.log(res);
          if (res != null || res != "") {
            wx.hideLoading();
            if (res.data.code == 0) {
              util.showToast("扫描成功！");
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              });
            } else if (res.data.code == 12){
              let limit = this.data.limit;              
              let num = limit++;
              console.log(limit);

              if (limit < 3) {
                util.showToast("扫描失败！");
                this.setData({
                  isShowImg: true,
                  limit: num
                });
              }              
            }
          }
        })
      }
    })
  }
})