Component({
  properties: {
    itemList: {
      type: Array,
      value: ["多层公寓", "高层公寓", "花园住宅", "工业厂房", "商铺", "办公楼", "已购公房、房改房", "商住两用", "经济适用房 ", "其它"]
    },
    selectWidth: {
      type: String,
      value: "150rpx"
    },
    optionsHeight: {
      type: String,
      value: "270rpx"
    },
    selectItemContent: {
      type: String,
      value: "请选择"
    }
  },
  data: {
    showDropItem: true
  },
  methods: {
    showItemData() {      
      this.setData({
        showDropItem: !this.data.showDropItem
      })
    },
    selectItem(e) {        
      let itemIdx = e.currentTarget.dataset.selectitemindex;
      let item = e.currentTarget.dataset.selectitem;
      let itemObj = {
        item,
        itemIdx
      }
      this.setData({
        showDropItem: true,
        selectItemContent: item
      })
      this.triggerEvent("selectItem", itemObj);  //自定义方法——传值。传到使用页面时，通过e.detail拿取具体的值   有点像VUE的bus
    },
    cancle(){
      this.setData({
        showDropItem: !this.data.showDropItem
      })
    }
  }
})