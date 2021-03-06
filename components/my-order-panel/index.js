// components/my-order-panel/index.js

import { OrderRequest } from '../../model/order'

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    unpaidCount: 0,
    paidCount: 0,
    deliveredCount: 0
  },

  pageLifetimes: {
    async show() {
      const unpaidCount = await OrderRequest.getUnpaidCount() // 待支付
      const paidCount = await OrderRequest.getPaidCount() // 待发货
      const deliveredCount = await OrderRequest.getDeliveredCount() // 待收货
      console.log(
        unpaidCount,
        paidCount,
        deliveredCount
      )
      this.setData({
        unpaidCount,
        paidCount,
        deliveredCount
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotoMyOrder(event) {
      const key = event.currentTarget.dataset.key
      wx.navigateTo({
        url: `/pages/my-order/index?key=${key}`
      })
    }
  }
})
