/**
 * 购物车类
 */
class Cart {
  // 这些值可以改为从服务端获取
  // 单品的最大和最小值
  static SKU_MIN_COUNT = 1
  static SKU_MAX_COUNT = 99
  // 购物车内商品总数的最大值
  static CART_ITEM_MAX_COUNT = 99
  static CART_KEY = 'cart'

  cartData = null
  
  // 单例模式
  constructor() {
    if (typeof Cart.instance === 'object') {
      return Cart.instance
    }
    Cart.instance = this
    this._getCartData()
    return this
  }

  addItem(newItem) {
    if (this.cartData.items.length > Cart.CART_ITEM_MAX_COUNT) {
      throw new Error('超过购车最大数量')
    }

    const oldItem = this.cartData.find((item) => item.skuId === newItem.skuId)

    if (!oldItem) {
      this.cartData.items.unshift(newItem)
    } else {
      oldItem.count += newItem.count
      if (oldItem.count >= Cart.SKU_MAX_COUNT) {
        oldItem.count = Car.SKU_MAX_COUNT
      }
    }
    
    wx.setStorageSync(Cart.CART_KEY, this.cartData) // 更新缓存
  }

  removeItem(skuId) {
    const oldItemIndex = this.cartData.findIndex((item) => item.skuId === skuId)
    if (oldItemIndex !== -1) {
      this.cartData.items.splice(oldItemIndex, 1)
      wx.setStorageSync(Cart.CART_KEY, this.cartData) 
    }
  }

  _getCartData() {
    let cartData = wx.getStorageSync(Cart.CART_KEY)
    if (!cartData) {
      const data = { items: [] }
      wx.setStorageSync(Cart.CART_KEY, data)
      cartData = data
    } else {
      cartData = cartData
    }
    this.cartData = cartData
  }
}

export {
  Cart
}
