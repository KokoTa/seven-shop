import { FenceGroup } from '../model/fence-group'
import { Judger } from '../model/judger'
import { Spu } from '../../model/spu'
import { Cart } from '../model/cart'

/**
 * 组件关系：realm > fence > cell
 */
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object, // spu 数据
    shoppingWay: String
  },

  /**
   * 生命周期里不能确保数据已经传入进来
   * 因此这里要使用监听器
   */
  observers: {
    spu: function (spu) {
      if (!spu) return
      if (!spu.title) return

      if (Spu.isNoSpec(spu)) {
        this.processNoSpec(spu)
      } else {
        this.processHasSpec(spu)
      }

      this.outStockStatus()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    judger: {},
    previewImg: '',
    title: '',
    price: 0,
    discountPrice: 0,
    stock: 0,
    noSpec: false,
    isSkuIntact: false,
    outStock: false,
    currentSkuCount: Cart.SKU_MIN_COUNT
  },

  /**
   * 组件的方法列表
   */
  methods: {
    processNoSpec (spu) {
      this.setData({ noSpec: true })
      this.triggerEvent('skuChoice', { noSpec: true })
      this.bindSkuData(spu.sku_list[0])
    },
    processHasSpec (spu) {
      // 规格集合类
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFences()

      // 数据判断与操作类
      const judger = new Judger(fenceGroup)
      this.setData({ judger })
      this.bindTipData()

      // 头部信息，如果有默认记录，那么就赋值默认记录的信息，如果没有，则赋值 spu 的信息
      const defaultSku = fenceGroup.getDefaultSku()
      if (defaultSku) {
        this.bindSkuData(defaultSku)
      } else {
        this.bindSpuData()
      }
    },

    // 接收 cell 组件冒泡上来的事件
    onCellTap (e) {
      const detail = e.detail
      const judger = this.data.judger
      judger.judge(detail) // 改变 cell 状态
      this.bindTipData()

      // 检查是否选择了一条完整 sku 路径
      const sku = judger.getDeterminateSku()
      if (sku) {
        this.bindSkuData(sku)
      } else {
        this.bindSpuData()
      }

      this.outStockStatus()
    },

    bindTipData () {
      const judger = this.data.judger
      const isSkuIntact = judger.isSkuIntact() // 是否选择了完整路径
      const missingSpecKeys = judger.getMissingSpecKeys() // 未选择的规格名
      const intactSpecValues = judger.getIntactSpecValues() // 已选择的规格值

      this.setData({
        fences: judger.fenceGroup.fences,
        isSkuIntact,
        missingSpecKeys,
        intactSpecValues
      })

      this.triggerEvent('skuChoice', {
        noSpec: this.data.noSpec,
        isSkuIntact,
        missingSpecKeys,
        intactSpecValues
      })
    },
    bindSkuData (sku) {
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price,
        stock: sku.stock
      })
    },
    bindSpuData () {
      const spu = this.properties.spu
      this.setData({
        previewImg: spu.img,
        title: spu.title,
        price: spu.price,
        discountPrice: spu.discount_price,
        stock: spu.stock ? spu.stock : 0 // 当有规格选择时，spu.stock 不存在，小程序不能赋值 undefined
      })
    },

    onSelectCount (e) {
      this.setData({ currentSkuCount: e.detail.count })
      this.outStockStatus()
    },
    // 判断缺货状态
    outStockStatus () {
      const { stock, currentSkuCount } = this.data
      const outStock = stock < currentSkuCount
      console.log(stock, currentSkuCount)
      this.setData({ outStock })
    }
  }
})
