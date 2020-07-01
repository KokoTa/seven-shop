// components/checkbox/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false
    }
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
    onCheck() {
      const checked = this.properties.checked
      this.triggerEvent('check', { checked: !checked })
    }
  }
})
