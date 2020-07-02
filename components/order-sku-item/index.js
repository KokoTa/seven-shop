import { parseSpecValue } from "../../utils/sku"

// components/order-sku-item/index.js
Component({
  
  externalClasses:['l-class'],
  
  /**
   * 组件的属性列表
   */

  properties: {
    orderItem:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    specValuesText:null
  },

  observers:{
    'orderItem':function (orderItem) {
      this.setData({
        specValuesText: parseSpecValue(orderItem.specs)
      })
    },
  }
})
