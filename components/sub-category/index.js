// components/sub-category/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    subCategories: Array,
    bannerImg: String
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
    onItemTap (e) {
      const id = e.detail.key
      this.triggerEvent('itemTap', { id })
    }
  }
})
