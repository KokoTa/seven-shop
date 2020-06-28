import { Spu } from '../../model/spu'
// pages/detail.js
import { ShoppingWay } from '../../core/enum'
import { SaleExplain } from '../../model/sale-explain'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spu: {},
    saleExplain: [],
    showRealm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    const explain = await SaleExplain.getFixed()

    this.setData({ spu, explain })
  },

  onAddToCart () {
    this.setData({
      showRealm: true,
      shoppingWay: ShoppingWay.CART
    })
  },
  onBuy () {
    this.setData({
      showRealm: true,
      shoppingWay: ShoppingWay.BUY
    })
  },
  onGoToHome () {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },
  onGoToCart () {
    wx.switchTab({
      url: '/pages/cart/index'
    })
  },
  onSkuChoice (data) {
    console.log(data.detail)
    this.setData({
      ...data.detail
    })
  },
  onShopping(data) {
    console.log(data.detail)
  }
})
