import { Cart } from "../../components/model/cart"
import { Sku } from "../../model/sku"
import { OrderItem } from "../../components/model/order-item"
import { Order } from "../../components/model/order"

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
    // 这里不获取缓存中的 sku 项，而是获取 sku id 数组，这是因为缓存的数据可能不是最新的，要从服务端那边获取数据
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
  },

  async getCartOrderItems(skuIds) {
    // 同步最新 SKU 数据，下架的商品不会返回
    const res = await Sku.getSkuByIds(skuIds)
    const checkedSkus = res.data
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

  
})