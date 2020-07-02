import { Sku } from "../../model/sku"

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

    const oldItem = this.cartData.items.find((item) => item.skuId === newItem.skuId)

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
    const oldItemIndex = this.cartData.items.findIndex((item) => item.skuId === skuId)
    if (oldItemIndex !== -1) {
      this.cartData.items.splice(oldItemIndex, 1)
      wx.setStorageSync(Cart.CART_KEY, this.cartData) 
    }
  }

  checkItem(skuId, checked) {
    this.cartData.items.forEach((item) => {
      if (item.skuId === skuId) item.checked = checked
    })
    wx.setStorageSync(Cart.CART_KEY, this.cartData)
  }

  checkedAll(checked) {
    this.cartData.items.forEach((item) => {
      item.checked = checked
    })
    wx.setStorageSync(Cart.CART_KEY, this.cartData)
  }

  changeItemCount(skuId, count) {
    const index = this.cartData.items.findIndex((item) => item.skuId === skuId)
    if (index !== -1) {
      const cartItem = this.cartData.items[index]
      // 这里不需要判断边界情况，因为 counter 组件已经帮我们判断了
      cartItem.count = count
    }
    wx.setStorageSync(Cart.CART_KEY, this.cartData)
  }

  getTotalCount() {
    const items = this.cartData.items
    let count = 0
    items.forEach((item) => count += item.count)
    return count
  }

  getCheckedItems() {
    return this.cartData.items.filter((item) => item.checked)
  }

  getCheckedSkuIds() {
    return this.cartData.items.filter((item) => item.checked).map((item) => item.skuId)
  }

  async getAllSkuFromServer() {
    const cartData = this.cartData
    if (cartData.items.length === 0) return null
    const skuIds = this.getSkuIds()
    const serverData = await Sku.getSkuByIds(skuIds)
    return serverData.data
  }

  getSkuIds() {
    const cartData = this.cartData
    if (cartData.items.length === 0) return []
    return cartData.items.map((item) => item.skuId)
  }

  refreshSkus(skus) {
    const cartItems = this.cartData.items

    // 如果商品下架，则服务端不会返回该商品，前端需要手动下架该商品
    cartItems.forEach((cartItem) => {
      let removeFlag = true
      skus.forEach((sku) => {
        if (cartItem.skuId === sku.id) {
          cartItem.sku = sku
          removeFlag = false
        }
      })
      if (removeFlag) {
        cartItem.sku.online = false
      }
    })
    
    wx.setStorageSync(Cart.CART_KEY, this.cartData)

    return cartItems
  }

  isEmpty() {
    return this.cartData.items.length === 0
  }

  isAllChecked() {
    return this.cartData.items.every((item) => item.checked)
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

  static isSoldOut(item) {
    return item.sku.stock === 0
  }

  static isOnline(item) {
    return item.sku.online
  }
}

export {
  Cart
}
