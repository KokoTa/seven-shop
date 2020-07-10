import { Spu } from '../../model/spu'
// pages/detail.js
import { ShoppingWay, CouponCenterType } from '../../core/enum'
import { SaleExplain } from '../../model/sale-explain'
import { Cart } from '../../components/model/cart'
import { CartItem } from '../../components/model/cart-item'
import { Coupon } from '../../model/coupon'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    spu: {},
    saleExplain: [],
    showRealm: false,
    cartItemCount: 0,
    coupons: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    // const explain = await SaleExplain.getFixed() // 自己的服务器暂时没数据
    const explain = []
    const coupons = await Coupon.getTop2CouponsByCategory(spu.category_id)

    this.setData({ spu, explain, coupons })
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
  onGoToCouponCenter() {
    const type = CouponCenterType.SPU_CATEGORY
    const cid = this.data.spu.category_id
    wx.navigateTo({
      url: `/pages/coupon/index?cid=${cid}&type=${type}`,
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

    if (orderWay === ShoppingWay.CART) { // 加入购物车
      const cart = new Cart()
      const cartItem = new CartItem(sku, skuCount)
      cart.addItem(cartItem)
      this.updateCartCount()
    }

    if (orderWay === ShoppingWay.BUY) { // 立即购买
      wx.navigateTo({
        url: `/pages/order/index?skuId=${sku.id}&count=${skuCount}&way=${ShoppingWay.BUY}`,
      })
    }
  },

  // 获取购物车购买总数
  updateCartCount() {
    const cart = new Cart()
    const totalCount = cart.getTotalCount()
    this.setData({ cartItemCount: totalCount, showRealm: false })
  }
})
