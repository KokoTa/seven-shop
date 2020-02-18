import { SkuCode } from './sku-code';
/**
 * 路径字典判断类
 * 拆解 SKU，检查路径
 */
import { CellStatus } from '../../core/enum';

class Judger {
  fenceGroup
  pathDict = []

  constructor(fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initPathDict()
  }

  // 初始化字典路径
  _initPathDict() {
    this.fenceGroup.spu.sku_list.forEach(item => {
      const skuCode = new SkuCode(item.code)
      this.pathDict.push(...skuCode.totalSegments)
    })
  }

  // 判断 Cell 状态
  judge(cell) {
    this._changeCellStatus(cell)
  }

  _changeCellStatus(cell) {
    if (cell.status === CellStatus.WAITING) {
      cell.status = CellStatus.SELECTED
    } else if (cell.status === CellStatus.SELECTED) {
      cell.status = CellStatus.WAITING
    }
  }
}

export {
  Judger
}
