// app.js

import { Cart } from "./components/model/cart"
import { Token } from "./model/token"

// jo0GiXoiHTnioWhp
App({
  onLaunch: function () {
    // 检查是否有购物车数据
    const cart = new Cart()
    if (!cart.isEmpty()) wx.showTabBarRedDot({ index: 2 })
    
    const token = new Token()
    token.verify()
  },
  globalData: {
    userInfo: null
  }
})
