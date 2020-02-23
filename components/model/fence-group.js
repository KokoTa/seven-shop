import { Matrix } from './matrix';
/**
 * 规格集合类
 * 数据结构见 data.js
 * 组件嵌套关系： fence-group > fence > cell
 */
import { Fence } from './fence';

class FenceGroup {
  spu
  skuList = []
  fences = []

  constructor(spu) {
    this.spu = spu
    this.skuList = spu.sku_list
  }

  initFences() {
    const matrix = this._createMatrix(this.skuList)
    const fences = [] // 规格行数组
    const newMatrix = matrix.transpose() // 矩阵转置

    newMatrix.forEach((arr, index) => {
      const fence = new Fence(arr)
      fence.init()
      fences.push(fence)
    })

    this.fences = fences
  }

  // 创建矩阵对象
  _createMatrix(skuList) {
    let m = []

    skuList.forEach(sku => {
      m.push(sku.specs)
    })

    return new Matrix(m)
  }

  // 查找是否有默认记录
  getDefaultSku() {
    const defaultSkuId = this.spu.default_sku_id
    if (!defaultSkuId) return
    const defaultSku = this.skuList.find((s) => s.id === defaultSkuId)
    return defaultSku
  }

  // 通过坐标改变某个 cell 的状态
  setCellStatusByXY(x, y, status) {
    this.fences[x].cells[y].status = status
  }

  // 通过 id 改变某个 cell 的状态
  setCellStatusById(cellId, status) {
    this._eachCell((cell) => {
      if (cell.id === cellId) {
        cell.status = status
      }
    })
  }

  _eachCell(cb) {
    const fences = this.fences
    for (let i = 0; i < fences.length; i++) {
      for (let j = 0; j < fences[i].cells.length; j++) {
        const cell = fences[i].cells[j]
        cb(cell, i, j)
      }
    }
  }
}

export {
  FenceGroup
}
