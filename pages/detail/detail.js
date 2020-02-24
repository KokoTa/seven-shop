import { Spu } from '../../model/spu';
// pages/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRealm: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)

    this.setData({ spu })
  },

  onGoToHome() {},
  onGoToCart() {},
  onAddToCart() {
    this.setData({
      showRealm: true
    })
  },
  onBuy() {
    this.setData({
      showRealm: true
    })
  },
})
