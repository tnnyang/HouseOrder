// pages/fuyi/fuyi.js
const util = require('../../utils/util.js');
const sendRequestApi = require('../../api/sendRequestApi.js');
let modelArr = [];
let imageArr = [];
let imageObj = {};
let guid = "";
let uIdArr = [];

Page({
  data: {
    isShowPage: false,
    orderInfo: {},
    houseList: [],
    assessDate: "",
    managerName: "",
    selectItem: ["价格偏高", "价格偏低", "其他"],
    selectDefault: "请选择",
    selectIndex: 0,
    dqbHouseLogModels: [],
    imgPath: util.ServerConfig.resource + "/file/preview.ashx?GUID="
  },
  onLoad: function (opts) {
    let params = {
      orderId: opts.orderId,
    }

    util.dataStorage.Save("fuYiOrderId", opts.orderId);
    util.dataStorage.Save("fuYiPerson", opts.person);

    this.setData({
      managerName: opts.person
    });    

    wx.showNavigationBarLoading();

    sendRequestApi.getPingFangDetailApi(params).then(res => {
      if (res.data.code == 0) {
        let { data: { houseList, orderInfo } } = res;
        let date = util.formatTime(new Date(orderInfo.createTime));

        for(let i = 0; i < houseList.length; i++){
          let reason = {
            urlId: "",
            caseBack: "",
            houseId: "",
            message: ""
          }

          modelArr.push(reason);
          modelArr[i].houseId = houseList[i].id;
          houseList[i].selectDefault = "请选择";
          houseList[i].isShowSelectDefault = true;
          houseList[i].imgList = [];
          houseList[i].marginTop = 0;
          houseList[i].paddingBottom = "20rpx"
        }

        this.setData({
          isShowPage: true,
          orderInfo: orderInfo,
          houseList: houseList,
          assessDate: date,
          dqbHouseLogModels: modelArr          
        });

        wx.hideNavigationBarLoading();
      }
    });
  },
  //理由下拉
  selectItem(e){
    let idx = e.currentTarget.dataset.index;
    let caseBack = "dqbHouseLogModels[" + idx + "].caseBack";
    let isShowSelectDefault = "houseList[" + idx + "].isShowSelectDefault";
    let reasonCaseBack = "";

    if (e.detail.value == 0){
      reasonCaseBack = "价格偏高";
    } else if (e.detail.value == 1){
      reasonCaseBack = "价格偏低";
    } else if (e.detail.value == 2) {
      reasonCaseBack = "其他";
    }
    
    this.setData({
      selectIndex: e.detail.value,
      [caseBack]: reasonCaseBack,
      [isShowSelectDefault]: false
    });
  },
  explanationInput: function(e){
    let idx = e.currentTarget.dataset.index;
    let message = "dqbHouseLogModels[" + idx + "].message";
    this.setData({
      [message]: e.detail.value
    });
  },
  //上传房产证
  uploadFile: function (e) {
    wx.chooseImage({
      count: 1,   //最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {   //成功则返回图片的本地文件路径列表 tempFilePaths
        var tempFilePaths = res.tempFilePaths;
        let url = util.ServerConfig.resource + "/file/upload.ashx?UploadUser=1111";

        wx.showLoading({
          title: "正在上传",
          mask: true
        });

        wx.uploadFile({
          url: url,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          success: res => {
            wx.hideLoading();
            let imgPath = this.data.imgPath + JSON.parse(res.data)[0].fileGUID;
            let idx = e.currentTarget.dataset.index;

            let urlId = "dqbHouseLogModels[" + idx + "].urlId";
            uIdArr = this.data.dqbHouseLogModels[idx].urlId.split(",");
            uIdArr.push(JSON.parse(res.data)[0].fileGUID);

            //删除初始数组中的空元素
            uIdArr = util.deletArrEmpty(uIdArr);
            guid = uIdArr.join();

            let imgList = "houseList[" + idx + "].imgList";
            imageArr = this.data.houseList[idx].imgList;   //先获取

            imageObj = {
              imageSrc: imgPath,
              fileGuid: JSON.parse(res.data)[0].fileGUID,
              isShowDelete: true
            }

            imageArr.push(imageObj);   //再push

            let marginTop = "houseList[" + idx + "].marginTop";
            let paddingBottom = "houseList[" + idx + "].paddingBottom";

            this.setData({
              [urlId]: guid,
              [imgList]: imageArr,
              [marginTop]: "30rpx",
              [paddingBottom]: 0,
            });
          }
        })
      },
      fali: (error) => {
        console.log(error);
      }
    })
  },
  //长按出现删除房产证icon
  showDelete: function (e) {
    let imgIdx = e.currentTarget.dataset.imgidx;
    let deedIdx = e.currentTarget.dataset.deedidx;
    let isShowDelete = "houseList[" + deedIdx + "].imgList[" + imgIdx + "].isShowDelete";

    this.setData({
      [isShowDelete]: !this.data.houseList[deedIdx].imgList[imgIdx].isShowDelete
    });
  },
  //删除房产证
  deleteImage: function (e) {
    let fileGuid = e.currentTarget.dataset.guid;
    let imgIdx = e.currentTarget.dataset.imgidx;
    let deedIdx = e.currentTarget.dataset.deedidx;
    let setImgList = "houseList[" + deedIdx + "].imgList";
    let urlId = "dqbHouseLogModels[" + deedIdx + "].urlId";
    let imgList = this.data.houseList[deedIdx].imgList;
    let gurlId = this.data.dqbHouseLogModels[deedIdx].urlId;
    let urlIdArr = gurlId.split(",");
    let marginTop = "houseList[" + deedIdx + "].marginTop";
    let paddingBottom = "houseList[" + deedIdx + "].paddingBottom";

    sendRequestApi.deleteDeedApi(fileGuid).then(res => {
      if (res.data.code == 200) {
        imgList.splice(imgIdx, 1);
        urlIdArr.splice(imgIdx, 1);
        gurlId = urlIdArr.join();

        if (imgList.length < 1){
          this.setData({
            [marginTop]: 0,
            [paddingBottom]: "20rpx"
          });
        }

        this.setData({
          [setImgList]: imgList,
          [urlId]: gurlId
        });
      }
    })
  },
  submit: function(){
    let params = {
      orderId: this.data.orderInfo.id,
      dqbHouseLogModels: this.data.dqbHouseLogModels
    }

    sendRequestApi.PingFangFuYiApi(params).then(res => {
      if(res.data.code == 0){
        util.showToast("提交成功");
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/fuyi/fuyi?orderId=' + util.dataStorage.Get("fuYiOrderId") + '&person=' + util.dataStorage.Get("fuYiPerson")
          })
        }, 2500);
      }
    })
  },
  cancle: function(){
    wx.navigateBack({
      delta: 1
    })
  }
})