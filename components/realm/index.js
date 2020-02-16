import { FenceGroup } from '../model/fence-group';
// components/realm/realm.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object // spu 数据
  },

  /**
   * 生命周期里不能确保数据已经传入进来
   * 因此这里要使用监听器
   */
  observers: {
    'spu': function (spu) {
      if (!spu) return

      const fenceGroup = new FenceGroup(spu)
      console.log(fenceGroup.initFences())
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

  }
})
