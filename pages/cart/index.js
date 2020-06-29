import { Cart } from "../../components/model/cart"

// pages/cart/index.js
Page({

  data: {
    cartItems: [],
    isEmpty: true
  },

  // 购物车数据要保持最新的
  onShow(options) {
    const cart = new Cart()
    const cartItems = cart.cartData.items
    const isEmpty = cart.isEmpty()
    this.setData({ cartItems, isEmpty })
    // 进入页面后把小红点去掉
    wx.hideTabBarRedDot({
      index: 2,
    })
  },

  goHome() {
    wx.switchTab({
      url: '/pages/home/index',
    })
  },

  onCartItemCheck(e) {
    const cartItems = this.data.cartItems.map((item) => {
      item.checked = e.detail.checked
      return item
    })
    this.setData({ cartItems })
  }
})
