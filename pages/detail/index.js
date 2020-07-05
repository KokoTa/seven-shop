import { Spu } from '../../model/spu'
// pages/detail.js
import { ShoppingWay } from '../../core/enum'
import { SaleExplain } from '../../model/sale-explain'
import { Cart } from '../../components/model/cart'
import { CartItem } from '../../components/model/cart-item'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spu: {},
    saleExplain: [],
    showRealm: false,
    cartItemCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(-1)
    // const explain = await SaleExplain.getFixed()
    const explain = []

    this.setData({ spu, explain })
  },

  // 进页面的时候获取购物总数
  onShow() {
    this.updateCartCount()
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
    const { orderWay, sku, skuCount, spuId } = data.detail

    if (orderWay === Cart.CART_KEY) { // 加入购物车
      const cart = new Cart()
      const cartItem = new CartItem(sku, skuCount)
      cart.addItem(cartItem)
    }

    this.updateCartCount()
  },

  // 获取购物车购买总数
  updateCartCount() {
    const cart = new Cart()
    const totalCount = cart.getTotalCount()
    this.setData({ cartItemCount: totalCount, showRealm: false })
  }
})
