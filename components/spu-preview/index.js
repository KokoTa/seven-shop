// components/spu-preview/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: Object // 瀑布流组件传输数据给自定义组件的属性名为 data
  },

  /**
   * 组件的初始数据
   */
  data: {
    tags: []
  },

  observers: {
    data: function (data) {
      if (!data) return
      if (!data.tags) return

      const tags = data.tags.split('$')

      this.setData({
        tags
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onItemTap () {
      const { id } = this.data.data
      wx.navigateTo({ url: `/pages/detail/index?pid=${id}` })
    }
  }
})
