import { Cart } from '../../components/model/cart'
import { Calculator } from '../../components/model/calculator'
const cart = new Cart()

// pages/cart/index.js
Page({

  data: {
    cartItems: [],
    isEmpty: true,
    allChecked: false,
    totalPrice: 0,
    totalSkuCount: 0
  },

  // 购物车数据要保持最新的，因此每次显示时都要获取数据
  onShow () {
    const cartItems = cart.cartData.items
    const isEmpty = cart.isEmpty()
    this.setData({ cartItems, isEmpty })
    this.setIsAllChecked() // 更新全选状态
    this.updateTotalData() // 更新结算数据

    // 进入页面后把小红点去掉
    wx.hideTabBarRedDot({
      index: 2
    })
  },

  goHome () {
    wx.switchTab({
      url: '/pages/home/index'
    })
  },

  onCartItemCheck (e) {
    const { skuId, checked } = e.detail
    cart.checkItem(skuId, checked)
    const cartItems = cart.cartData.items
    this.setData({ cartItems })
    this.setIsAllChecked()
    this.updateTotalData()
  },
  onCheckAll () {
    const isAllChecked = cart.isAllChecked()
    isAllChecked ? cart.checkedAll(false) : cart.checkedAll(true)
    const cartItems = cart.cartData.items
    this.setData({ cartItems })
    this.setIsAllChecked()
    this.updateTotalData()
  },
  onItemDelete (e) {
    const cartItems = this.data.cartItems.filter((item) => item.skuId !== e.detail.skuId)
    this.setData({ cartItems })
    this.setIsAllChecked()
    this.updateTotalData()
  },
  onItemCountChange(e) {
    const { skuId, count } = e.detail
    cart.changeItemCount(skuId, count)
    const cartItems = cart.cartData.items
    this.setData({ cartItems })
    this.setIsAllChecked()
    this.updateTotalData()
  },
  onSettle () {

  },

  // 更新全选状态
  setIsAllChecked () {
    this.setData({ allChecked: cart.isAllChecked() })
  },
  // 更新结算数据
  updateTotalData () {
    const cartItems = cart.getCheckedItems()
    const calculator = new Calculator(cartItems)
    const { totalPrice, totalSkuCount } = calculator
    this.setData({ totalPrice, totalSkuCount })
  }
})
