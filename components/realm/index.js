import { FenceGroup } from '../model/fence-group';
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

      // 规格集合
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFences()
      this.setData({ fences: fenceGroup.fences })

      // 判断类
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
    onCellTap(e) {
      const detail = e.detail
      const judger = this.data.judger
      judger.judge(detail) // 改变 cell 状态
      this.setData({
        fences: judger.fenceGroup.fences
      })
    }
  }
})
