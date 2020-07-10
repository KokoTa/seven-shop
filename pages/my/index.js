const { Coupon } = require("../../model/coupon")
const { CouponStatus } = require("../../core/enum")

// pages/my/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const coupons = await Coupon.getMyCoupons(CouponStatus.AVAILABLE)
    this.setData({ couponCount: coupons.length })
  },
   
})
