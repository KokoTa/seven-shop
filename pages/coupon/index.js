import { CouponCenterType } from "../../core/enum"
import { Activity } from "../../model/activity"
import { Coupon } from "../../model/coupon"

// pages/coupon/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const aName = options.name
    const type = options.type
    const cid = options.cid

    let coupons

    if (type === CouponCenterType.ACTIVITY) {
        const activity = await Activity.getActivityWithCoupon(aName)
        coupons = activity.coupons
    }
    if (type === CouponCenterType.SPU_CATEGORY) {
        coupons = await Coupon.getCouponsByCategory(cid)
        const wholeStoreCoupons = await Coupon.getWholeStoreCoupons()
        coupons = coupons.concat(wholeStoreCoupons)
    }

    console.log(coupons)
    this.setData({
        coupons
    });
  }
})