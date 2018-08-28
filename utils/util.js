let common = {
  ServerConfig: {},
  ServerConfigInt: function () {
    let isTest = true;
    this.ServerConfig = isTest ? this.testApi : this.prodApi;
  },
  //测试环境
  testApi: {
    request: "https://dqbs.91zhaiquan.net:9081",
    resource: "https://fileapi.shunangtech.com:41101"
  },
  //生产环境
  prodApi: {
    request: "https://www.51daiqianbao.com:9081",
    resource: "https://fileapi.shunangtech.com:41101"
  },
  //将Object对象参数转换为URL参数
  objToUrlParams: obj => {
    let params = [];
    Object.keys(obj).forEach((key) => {
      let value = obj[key];

      if (typeof value === "undefined") {
        value = "";
      }

      params.push([key, value].join('='));
    })

    return params.join('&')
  },
  //数据缓存
  dataStorage: {
    Save: function (key, value) {
      wx.setStorageSync(key, value);
    },
    Get: function (key) {
      return wx.getStorageSync(key);
    },
    Remove: function (key) {
      wx.removeStorageSync(key);
    },
    Clear: function () {
      wx.clearStorageSync();
    }
  },
  //提示弹窗--2秒后自动消失
  showToast: function(title){
    wx.showToast({
      title: title,
      icon: "none",
      duration: 2000,
      mask: true
    });
  },
  //日期格式化
  formatTime: function(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('-') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  formatNumber: n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  //判断对象中key对应value是否为空
  objectValueNotNone: obj => {
    for (var objKey in obj) {
      if (!obj[objKey]) {
        return false;
      }
    }
    return true;
  },
  //删除数组中的空值
  deletArrEmpty: arr => {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == "") {
        arr.splice(i, 1);
        i = i - 1;
      }
    }
    return arr;
  }
}

module.exports = common