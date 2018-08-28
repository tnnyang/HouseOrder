// pages/addPingFang/addPingFang.js
const util = require('../../utils/util.js');
const config = require('../../api/config.js');
const sendRequestApi = require('../../api/sendRequestApi.js');
let deedList = [];
let imageArr = [];
let imageObj= {};
let guid = "";
let uIdArr = [];

Page({
  data: {
    deedData: {
      assessHouseModels: [
        {
          regionName: "",
          address: "",
          natureNameList: [],
          natureValueList: [],
          houseNature: 1,
          natureIndex: 0,
          natureDefault: "请选择",
          isShowNatureDefault: true,
          estatesNo: "",
          houseArea: "",
          areaRemark: "",
          province: "请选择",
          city: "",
          district: "",
          floorNo: "",
          floorSum: "",
          remark: "",
          urlId: "",
          assessPrice: "",
          imgList: [],
          deedInfo: {},
          isShowDefaultProvince: true
        }
      ]
    },
    isShowReduce: true,
    dialogContent: "",
    dialogWidth: "600rpx",
    dialogLineHeight: "50rpx"
  },
  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },
  onLoad: function(){
    this.getHouseNature();
  },
  //获取房产性质
  getHouseNature: function () {
    sendRequestApi.getHouseNatureApi().then(res => {
      if(res.data.code == 0){
        let {data: {data}} = res;
        
        let nameArr = [];
        let valueArr = [];
        let natureNameList = "deedData.assessHouseModels[0].natureNameList";
        let natureValueList = "deedData.assessHouseModels[0].natureValueList";

        for(let i = 0; i < data.length; i++){
          if (data[i].remark == "house_nature"){
            nameArr.push(data[i].name);
            valueArr.push(data[i].value);
          }
        }

        this.setData({
          [natureNameList]: nameArr,
          [natureValueList]: valueArr
        });
      }
    });
  },
  //省市联动
  bindRegionChange: function (e) {
    let idx = e.currentTarget.dataset.index;
    let province = "deedData.assessHouseModels[" + idx + "].province";
    let city = "deedData.assessHouseModels[" + idx + "].city";
    let district = "deedData.assessHouseModels[" + idx + "].district";
    let isShowDefaultProvince = "deedData.assessHouseModels[" + idx + "].isShowDefaultProvince";

    this.setData({
      [province]: e.detail.value[0],
      [city]: e.detail.value[1],
      [district]: e.detail.value[2],
      [isShowDefaultProvince]: false
    })
  },
  //选择房产性质
  houseNature(e){
    let idx = e.currentTarget.dataset.index;    
    let natureNameList = "deedData.assessHouseModels[" + idx + "].natureNameList";
    let natureValueList = "deedData.assessHouseModels[" + idx + "].natureValueList";
    let houseNature = "deedData.assessHouseModels[" + idx + "].houseNature";
    let natureIndex = "deedData.assessHouseModels[" + idx + "].natureIndex";
    let isShowNatureDefault = "deedData.assessHouseModels[" + idx + "].isShowNatureDefault";
    let detailValue = e.detail.value;
    let natureIdx = parseInt(detailValue) + 1;
    let nature = this.data.deedData.assessHouseModels[idx].natureValueList[detailValue];

    this.setData({
      [houseNature]: nature,
      [natureIndex]: detailValue,
      [isShowNatureDefault]: false
    });
  },
  //上传房产证
  uploadFile: function(e) {
    wx.chooseImage({
      count: 1,   //最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {   //成功则返回图片的本地文件路径列表 tempFilePaths
        var tempFilePaths = res.tempFilePaths;
        let url = util.ServerConfig.resource + "/file/upload.ashx?UploadUser=1111";

        wx.showLoading({
          title: "正在识别",
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
            let imgPath = util.ServerConfig.resource + "/file/preview.ashx?GUID=" + JSON.parse(res.data)[0].fileGUID;
            let IdentificationImgPath = util.ServerConfig.resource + "/file/download.ashx?GUID=" + JSON.parse(res.data)[0].fileGUID;
            let idx = e.currentTarget.dataset.index;
            let urlId = "deedData.assessHouseModels[" + idx + "].urlId";

            uIdArr = this.data.deedData.assessHouseModels[idx].urlId.split(",");            
            uIdArr.push(JSON.parse(res.data)[0].fileGUID);
            
            //删除初始数组中的空元素
            uIdArr = util.deletArrEmpty(uIdArr);
            guid = uIdArr.join();
            
            let imgList = "deedData.assessHouseModels[" + idx + "].imgList";
            imageArr = this.data.deedData.assessHouseModels[idx].imgList;     //先获取

            imageObj = {
              imageSrc: imgPath,
              fileGuid: JSON.parse(res.data)[0].fileGUID,
              isShowDelete: true
            }

            imageArr.push(imageObj);   //再push

            this.setData({
              [urlId]: guid,
              [imgList]: imageArr
            });

            //房产证自动识别
            let params = {
              urlId: IdentificationImgPath
            }

            sendRequestApi.deedDistinguishApi(params).then(res => {
              console.log(res);
              if(res != null || res != ""){
                wx.hideLoading();
                if (res.data.code == 0) {
                  let deedInfo = "deedData.assessHouseModels[" + idx + "].deedInfo";
                  this.setData({
                    [deedInfo]: res.data.data
                  });
                }
              }              
            })
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
    let isShowDelete = "deedData.assessHouseModels[" + deedIdx + "].imgList[" + imgIdx + "].isShowDelete";

    this.setData({
      [isShowDelete]: !this.data.deedData.assessHouseModels[deedIdx].imgList[imgIdx].isShowDelete
    });
  },
  //删除房产证
  deleteImage: function(e){
    let fileGuid = e.currentTarget.dataset.guid;
    let imgIdx = e.currentTarget.dataset.imgidx;
    let deedIdx = e.currentTarget.dataset.deedidx;
    let setImgList= "deedData.assessHouseModels[" + deedIdx + "].imgList";
    let urlId = "deedData.assessHouseModels[" + deedIdx + "].urlId";
    let imgList = this.data.deedData.assessHouseModels[deedIdx].imgList;
    let gurlId = this.data.deedData.assessHouseModels[deedIdx].urlId;
    let urlIdArr = gurlId.split(",");

    sendRequestApi.deleteDeedApi(fileGuid).then(res => {
      if(res.data.code == 200){
        imgList.splice(imgIdx, 1);
        urlIdArr.splice(imgIdx, 1);
        gurlId = urlIdArr.join();

        this.setData({
          [setImgList]: imgList,
          [urlId]: gurlId
        });
      }      
    })
  },
  //增加评房
  addDeed: function(){
    let deedList = this.data.deedData.assessHouseModels;
    let deedData = "deedData.assessHouseModels";
    let newValue = {
      regionName: "",
      address: "",
      natureNameList: deedList[0].natureNameList,
      natureValueList: deedList[0].natureValueList,
      houseNature: 1,
      natureIndex: 0,
      natureDefault: "请选择",
      isShowNatureDefault: true,
      estatesNo: "",
      houseArea: "",
      areaRemark: "",
      province: "请选择",
      city: "",
      district: "",
      floorNo: "",
      floorSum: "",
      remark: "",
      urlId: "",
      assessPrice: "",
      imgList: [],
      deedInfo: {},
      isShowDefaultProvince: true
    }

    deedList.push(newValue);

    this.setData({
      [deedData]: deedList,
      isShowReduce: false
    });
  },
  //减少评房
  reduceDeed: function(){
    let houseList = this.data.deedData.assessHouseModels;
    let assessHouseModels = "deedData.assessHouseModels";
    houseList.pop();

    this.setData({
      [assessHouseModels]: houseList
    })

    if (houseList.length < 2) {
      this.setData({
        isShowReduce: true
      })
    }
  },
  address: function(e){
    let idx = e.currentTarget.dataset.index;
    let address = "deedData.assessHouseModels[" + idx + "].address";
    this.setData({
      [address]: e.detail.value
    })
  },
  xiaoQuName: function (e) {
    let idx = e.currentTarget.dataset.index;
    let regionName = "deedData.assessHouseModels[" + idx + "].regionName";
    this.setData({
      [regionName]: e.detail.value
    })
  },
  deedNo: function (e) {
    let idx = e.currentTarget.dataset.index;
    let estatesNo = "deedData.assessHouseModels[" + idx + "].estatesNo";
    this.setData({
      [estatesNo]: e.detail.value
    })
  },
  inFloor: function (e) {
    let idx = e.currentTarget.dataset.index;
    let floorNo = "deedData.assessHouseModels[" + idx + "].floorNo";
    this.setData({
      [floorNo]: e.detail.value
    })
  },
  totalFloor: function (e) {
    let idx = e.currentTarget.dataset.index;
    let floorSum = "deedData.assessHouseModels[" + idx + "].floorSum";
    this.setData({
      [floorSum]: e.detail.value
    })
  },
  buildArea: function (e) {
    let idx = e.currentTarget.dataset.index;
    let houseArea = "deedData.assessHouseModels[" + idx + "].houseArea";
    this.setData({
      [houseArea]: e.detail.value
    })
  },
  AreaDesc: function (e) {
    let idx = e.currentTarget.dataset.index;
    let areaRemark = "deedData.assessHouseModels[" + idx + "].areaRemark";
    this.setData({
      [areaRemark]: e.detail.value
    })
  },
  deedPrice: function (e) {
    let idx = e.currentTarget.dataset.index;
    let assessPrice = "deedData.assessHouseModels[" + idx + "].assessPrice";
    this.setData({
      [assessPrice]: e.detail.value
    })
  },
  remarks: function (e) {
    let idx = e.currentTarget.dataset.index;
    let remark = "deedData.assessHouseModels[" + idx + "].remark";
    this.setData({
      [remark]: e.detail.value
    })
  },
  //取消事件
  _cancelEvent() {
    this.dialog.hideDialog();
  },
  //确认事件
  _confirmEvent() {
    this.dialog.hideDialog();

    let data = this.data.deedData;
    this.pingFangFoo(data);
  },
  //开始评房
  startPingFang: function(){
    let params = this.data.deedData.assessHouseModels;

    for(let i = 0; i < params.length; i++){
      if (params[i].deedInfo){
        params[i].address = params[i].deedInfo.address ? params[i].deedInfo.address : params[i].address;
        params[i].estatesNo = params[i].deedInfo.unitnumber ? params[i].deedInfo.unitnumber : params[i].estatesNo;
        params[i].houseArea = params[i].deedInfo.buildarea ? params[i].deedInfo.buildarea : params[i].houseArea;
      }      

      if (params[i].imgList.length < 1) {
        util.showToast("请上传房产证");
        return false;
      } else if (params[i].address.length < 1){
        util.showToast("请填写房产详细地址");
        return false;
      } else if (params[i].regionName.length < 1) {
        util.showToast("请填写小区名称");
        return false;
      } else if (params[i].estatesNo.length < 1) {
        util.showToast("请填写房产编号");
        return false;
      } else if (params[i].floorNo.length < 1) {
        util.showToast("请填写所在楼层");
        return false;
      } else if (params[i].floorSum.length < 1) {
        util.showToast("请填写总楼层");
        return false;
      } else if (params[i].houseNature.length < 1) {
        util.showToast("请填写房产性质");
        return false;
      } else if (params[i].houseArea.length < 1) {
        util.showToast("请填写房产面积");
        return false;
      } else if (params[i].assessPrice.length < 1) {
        util.showToast("请填写房产自估价");
        return false;
      }
    }    

    let data = this.data.deedData;

    sendRequestApi.CheckPingFangApi(data).then(res => {
      if (res.data.code == 0) {   //15天内没有重复的房屋信息
        this.pingFangFoo(data);
      } else if (res.data.code == 10) {  //15天内有重复的房屋信息
        this.setData({
          dialogContent: "您的订单疑似在15内重复评估过，您确定还要提交评估吗？"
        });
        this.dialog.showDialog();
      }
    })    
  },
  pingFangFoo(data){
    sendRequestApi.addPingFangApi(data).then(res => {
      if (res.data.code == 0) {
        util.showToast('评房订单成功');

        setTimeout(function () {
          wx.navigateTo({
            url: "/pages/addPingFang/addPingFang?random=" + new Date()
          })
        }, 2500)
      }
    })
  }
})