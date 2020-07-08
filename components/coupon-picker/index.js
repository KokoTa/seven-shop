// components/coupon-picker/index.js
import {
  getSlashYMD
} from "../../utils/date";
import {
  CouponOperate
} from "../../core/enum";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    coupons: Array // 这里传入的是 CouponBO
  },


  observers: {
    'coupons': function (coupons) {
      if (coupons.length === 0) {
        return
      }
      const couponsView = this.convertToView(coupons) // 把 couponBO 转换成可视数据
      const satisfactionCount = this.getSatisfactionCount(coupons) // 优惠券是否满足条件
      console.log('coupons', coupons)
      console.log('couponsView', couponsView)
      this.setData({
        _coupons: couponsView,
        satisfactionCount
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _coupons: [],
    currentKey: null,
    satisfactionCount: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 把 couponBO 转成可视数据
    convertToView(coupons) {
      const couponsView = coupons.map(c => {
        const coupon = c.coupon
        return {
          id: coupon.id,
          title: coupon.title,
          startTime: getSlashYMD(coupon.start_time),
          endTime: getSlashYMD(coupon.end_time),
          satisfaction: coupon.satisfaction
        }
      })
      couponsView.sort((a, b) => {
        if (a.satisfaction) { // 如果优惠券可以使用就让它往视图前面排
          return -1
        }
      })
      return couponsView
    },

    // 可用优惠券数量
    getSatisfactionCount(couponBOs) {
      return couponBOs.reduce((pre, couponBO) => {
        if (couponBO.coupon.satisfaction === true) {
          return pre + 1
        }
        return pre
      }, 0)
    },

    onChange(event) {
      const currentKey = event.detail.currentKey // 当前选择的 key，可能为空值
      const key = event.detail.key // 元素绑定的 key
      this.setData({
        currentKey
      })
      const currentCoupon = this.findCurrentCoupon(currentKey, key)
      const operate = this.decidePickOrUnPick(currentKey)
      this.triggerEvent('choose', {
        coupon: currentCoupon,
        operate
      })
    },

    decidePickOrUnPick(currentKey) {
      if (currentKey === null) { // 没有值意味着没有选择优惠券
        return CouponOperate.UNPICK
      } else {
        return CouponOperate.PICK
      }
    },

    findCurrentCoupon(currentKey, key) {
      let couponBO = null
      if (currentKey === null) {
        couponBO = this.properties.coupons.find(couponBO => couponBO.coupon.id == key)
      } else {
        couponBO = this.properties.coupons.find(couponBO => couponBO.coupon.id == currentKey)
      }
      return couponBO.coupon
    }

  }
})
