import { Cart } from "../../components/model/cart"
import { Sku } from "../../model/sku"
import { OrderItem } from "../../components/model/order-item"
import { Order } from "../../components/model/order"
import { Coupon } from "../../model/coupon"
import { CouponBO } from "../../components/model/couponBO"
import { CouponOperate } from "../../core/enum"

const cart = new Cart()

// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderItems: [],
    couponBOList: [],
    finalTotalPrice: 0,
    discountPrice: 0,
    currentCouponId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 这里不获取缓存中的 sku 项，而是获取 sku id 数组，从服务端那边同步数据，因为缓存的数据可能不是最新的
    const skuIds = cart.getCheckedSkuIds()
    const orderItems = await this.getCartOrderItems(skuIds)
    const localItemCount = skuIds.length
    const order = new Order(orderItems, localItemCount)
    const totalPrice = order.getTotalPrice() // 还未用优惠券时的订单价格

    try {
      order.checkOrderIsOk()
      this.setData({ order, orderItems, finalTotalPrice: totalPrice })
    } catch(err) {
      console.error(err)
      return
    }

    // 获取我的优惠券数据
    const couponBOList = await this.getCoupons(order)
    this.setData({ couponBOList })
  },

  async getCartOrderItems(skuIds) {
    // 同步最新 SKU 数据，下架的商品不会返回
    const checkedSkus = await Sku.getSkuByIds(skuIds)
    const checkedItems = cart.getCheckedItems()

    let orderItems = []
    checkedSkus.forEach((sku) => {
      checkedItems.forEach((item) => {
        if (sku.id === item.skuId) {
          orderItems.push(new OrderItem(sku, item.count))
        }
      })
    })

    return orderItems
  },

  async getCoupons(order) {
    const coupons = await Coupon.getMySelfWithCategory()
    return coupons.map((coupon) => {
      const couponBO = new CouponBO(coupon)
      couponBO.meetingCondition(order) // 判断该优惠券是否可用，会赋值一个 satisfaction 属性
      return couponBO
    })
  },

  onChooseCoupon(e) {
    const { coupon, operate } = e.detail
    console.log(coupon, operate)

    if (operate === CouponOperate.PICK) { // 如果有选择优惠券
      const priceObj = CouponBO.getUseCouponFinalPrice(this.data.order.getTotalPrice(), coupon)
      this.setData({
        finalTotalPrice: priceObj.finalPrice,
        discountPrice: priceObj.discountPrice,
        currentCouponId: coupon.id
      })
    } else {
      this.setData({
        finalTotalPrice: this.data.order.getTotalPrice(),
        discountPrice: 0,
        currentCouponId: 0
      })
    }
  }
})