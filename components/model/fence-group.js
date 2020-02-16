import { Matrix } from './matrix';
/**
 * 规格行统筹操作
 * 数据结构见 data.json
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
    let currentJ = -1 // 用于判断是否遍历到下一列

    // 遍历从列先遍历的
    matrix.forEach((element, i, j) => {
      if (currentJ !== j) {
        currentJ = j
        // 矩阵转置，此时的列就是行
        fences[currentJ] = this._createFence()
      }
      fences[currentJ].pushValueTitle(element.value)
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

  // 创建规格行
  _createFence() {
    const fence = new Fence()
    return fence
  }
}

export {
  FenceGroup
}
