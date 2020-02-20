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
      // 判断类
      const judger = new Judger(fenceGroup)
      this.setData({
        judger,
        fences: judger.fenceGroup.fences
      })
      // 头部信息，如果有默认记录，那么就赋值默认记录的信息，如果没有，则赋值 spu 的信息
      const defaultSku = fenceGroup.getDefaultSku()
      if (defaultSku) {
        this.bindSkuData(defaultSku)
      } else {
        this.bindSpuData(spu)
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    judger: Object,
    previewImg: String,
    title: String,
    price: Number,
    discountPrice: Number
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 接收 cell 组件冒泡上来的事件
    onCellTap(e) {
      const detail = e.detail
      const judger = this.data.judger
      judger.judge(detail) // 改变 cell 状态
      this.setData({
        fences: judger.fenceGroup.fences
      })
    },

    bindSkuData(sku) {
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price
      })
    },
    bindSpuData() {
      const spu = this.properties.spu
      this.setData({
        previewImg: spu.img,
        title: spu.title,
        price: spu.price,
        discountPrice: spu.discount_price
      })
    }
  }
})
