import { SkuCode } from './sku-code';
/**
 * 路径字典判断类
 * 拆解 SKU，检查路径
 */

class Judger {
  fenceGroup
  pathDict = []

  constructor(fenceGroup) {
    this.fenceGroup = fenceGroup
  }

  initPathDict() {
    this.fenceGroup.spu.sku_list.forEach(item => {
      const skuCode = new SkuCode(item.code)
      this.pathDict.push(...skuCode.totalSegments)
    })
    console.log(this.pathDict)
  }
}

export {
  Judger
}
