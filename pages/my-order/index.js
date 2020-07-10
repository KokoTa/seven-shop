// pages/my-order/my-order.js

const { OrderRequest } = require("../../model/order")
const { OrderStatus } = require("../../core/enum")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeKey: OrderStatus.ALL,
    items: [],
    loadingType: 'loading',
    bottomLoading: true,
    paging: null,
    empty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const activeKey = options.key
    this.data.activeKey = options.key
    this.initItems(activeKey)
  },

  onShow() {
    this.initItems(this.data.activeKey)
  },

  async initItems(activeKey) {

    this.setData({
      activeKey,
      items: []
    })
    this.data.paging = this.getPaging(activeKey)
    const data = await this.data.paging.getMoreData()
    console.log(data)
    if (!data) {
      return
    }
    this.bindItems(data)
  },

  getPaging(activeKey) {
    activeKey = parseInt(activeKey)
    switch (activeKey) {
      case OrderStatus.ALL:
        return OrderRequest.getPagingByStatus(OrderStatus.ALL)
      case OrderStatus.UNPAID:
        return OrderRequest.getPagingUnpaid()
      case OrderStatus.PAID:
        return OrderRequest.getPagingByStatus(OrderStatus.PAID)
      case OrderStatus.DELIVERED:
        return OrderRequest.getPagingByStatus(OrderStatus.DELIVERED)
      case OrderStatus.FINISHED:
        return OrderRequest.getPagingByStatus(OrderStatus.FINISHED)
    }
  },

  bindItems(data) {
    if (data.empty) {
      this.setData({ empty: true })
      return
    }
    if (data.accumulator.length !== 0) {
      this.setData({
        items: data.accumulator,
        bottomLoading: true
      });
    }
    if (!data.moreData) {
      this.setData({
        loadingType: 'end'
      })
    }
  },

  onSegmentChange(event) {
    const activeKey = event.detail.activeKey
    this.initItems(activeKey)
  },

  async onReachBottom() {
    const data = await this.data.paging.getMoreData()
    this.bindItems(data)
  },

  onPaySuccess(event) {
    const oid = event.detail.oid
    wx.navigateTo({
      url: `/pages/pay-success/index?oid=${oid}`
    })
  }
})