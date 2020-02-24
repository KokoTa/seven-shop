// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    goToHome() {
      this.triggerEvent('goToHome', {})
    },
    goToCart() {
      this.triggerEvent('goToCart')
    },
    onAddToCart() {
      this.triggerEvent('addToCart')
    },
    onBuy() {
      this.triggerEvent('buy')
    },
  }
})
