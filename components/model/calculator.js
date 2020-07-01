import { accMultiply, accAdd } from "../../utils/number"

/**
 * 购物车计算类
 */
class Calculator {
  cartItems = null
  totalPrice = 0
  totalSkuCount = 0

  constructor(cartItems) {
    this.cartItems = cartItems
    this.init(cartItems)
  }

  init(cartItems) {
    cartItems.forEach((item) => this.push(item))
  }

  push(cartItem) {
    let cartItemTotalPrice = 0
    if (cartItem.sku.discount_price) {
      cartItemTotalPrice = accMultiply(cartItem.count, cartItem.sku.discount_price)
    } else {
      cartItemTotalPrice = accMultiply(cartItem.count, cartItem.sku.price)
    }
    this.totalPrice = accAdd(this.totalPrice, cartItemTotalPrice)
    this.totalSkuCount = accAdd(this.totalSkuCount, cartItem.count) 
  }
}

export {
  Calculator
}