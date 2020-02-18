import { FenceGroup } from '../model/fence-group';
// components/realm/realm.js
import { Judger } from '../model/judger';

/**
 * 组件关系：realm > fence > cell
 */
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

      // 生成规格集合并赋值
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFences()
      this.bindInitData(fenceGroup)

      // 生成判断类
      const judger = new Judger(fenceGroup)
      this.setData({ judger })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    judger: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindInitData(fenceGroup) {
      this.setData({
        fences: fenceGroup.fences
      })
    },
    onCellTap(e) {
      const cell = e.detail.cell
      const judger = this.data.judger
      judger.judge(cell) // 改变 cell 状态
      console.log(e)
      this.setData({
        fences: judger.fenceGroup.fences
      })
    }
  }
})
