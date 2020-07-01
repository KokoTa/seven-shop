import { parseSpecValue } from "../../utils/sku"
import { Cart } from '../model/cart'
const cart = new Cart()

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
        discount,
        stockMax: cartItem.sku.stock,
        stockCount: cartItem.count
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
    specStr: '',
    stockMax: Cart.SKU_MAX_COUNT,
    stockCount: Cart.SKU_MIN_COUNT
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onCheck(e) {
      const { skuId } = this.properties.cartItem
      const checked = e.detail.checked
      this.triggerEvent('check', { skuId, checked })
    },
    onDelete() {
      const { skuId } = this.properties.cartItem
      const cart = new Cart()
      cart.removeItem(skuId)
      this.triggerEvent('itemDelete', { skuId })
    },
    onSelectCount(e) {
      const { skuId } = this.properties.cartItem
      const { count } = e.detail
      this.triggerEvent('count', { skuId, count })
    }
  }
})
