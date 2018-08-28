// pages/findPwd/findPwd.js
Page({
  data: {
    phone: ""
  },
  onLoad: function (options) {
    let phone = options.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    this.setData({
      phone: phone
    });
  },  
})