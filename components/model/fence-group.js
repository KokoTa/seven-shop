import { Matrix } from './matrix';
/**
 * 规格行集合
 * 数据结构见 data.json
 * 组件嵌套关系： fence-group > fence > cell
 */
import { Fence } from './fence';

class FenceGroup {
  spu
  skuList = []

  constructor(spu) {
    this.spu = spu
    this.skuList = spu.sku_list
  }

  initFences() {
    const matrix = this._createMatrix(this.skuList)
    const fences = [] // 规格行数组
    const newMatrix = matrix.transpose() // 矩阵转置

    newMatrix.forEach((arr) => {
      const fence = new Fence(arr)
      fences.push(fence)
    })

    return fences;
  }

  // 创建矩阵对象
  _createMatrix(skuList) {
    let m = []

    skuList.forEach(sku => {
      m.push(sku.specs)
    })

    return new Matrix(m)
  }
}

export {
  FenceGroup
}
