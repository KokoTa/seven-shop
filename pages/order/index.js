import { Cart } from "../../components/model/cart"
import { Sku } from "../../model/sku"
import { OrderItem } from "../../components/model/order-item"
import { Order } from "../../components/model/order"
import { Coupon } from "../../model/coupon"
import { CouponBO } from "../../components/model/couponBO"

const cart = new Cart()

// pages/order/index.js
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
    // 这里不获取缓存中的 sku 项，而是获取 sku id 数组，从服务端那边获取数据，因为缓存的数据可能不是最新的
    const skuIds = cart.getCheckedSkuIds()
    const orderItems = await this.getCartOrderItems(skuIds)
    const localItemCount = skuIds.length
    const order = new Order(orderItems, localItemCount)

    try {
      order.checkOrderIsOk()
      this.setData({ orderItems })
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
      // couponBO.condition(order)
      return couponBO
    })
  }

  
})