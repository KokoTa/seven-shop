import { parseSpecValue } from "../../utils/sku"
import { Cart } from '../model/cart'

// components/cart-item/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    cartItem: {
      type: Object,
      value: null
    }
  },

  observers: {
    cartItem(cartItem) {
      if (!cartItem) return

      const specStr = parseSpecValue(cartItem.sku.specs)
      const soldOut = Cart.isSoldOut(cartItem)
      const online = Cart.isOnline(cartItem)
      const discount = cartItem.sku.discount_price ? true : false

      this.setData({
        specStr,
        soldOut,
        online,
        discount
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    online: false,
    soldOut: false,
    discount: false,
    specStr: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
