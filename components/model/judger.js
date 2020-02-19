/**
 * 路径字典判断类
 * 拆解 SKU，检查路径
 */
import { SkuCode } from './sku-code';
import { CellStatus } from '../../core/enum';
import { SkuPending } from './sku-pending';
import { Joiner } from '../../utils/joiner';

class Judger {
  fenceGroup
  pathDict = []
  skuPending

  constructor(fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initPathDict()
    this._initSkuPending()
  }

  // 初始化字典路径
  _initPathDict() {
    this.fenceGroup.spu.sku_list.forEach(item => {
      const skuCode = new SkuCode(item.code)
      this.pathDict.push(...skuCode.totalSegments)
    })
  }

  // 初始化记录类
  _initSkuPending() {
    const skuPending = new SkuPending()
    this.skuPending = skuPending
  }

  judge({ cell, x, y }) {
    this._changeCellStatus(cell, x, y)
    this._eachCell((cell, i, j) => {
      this._changeOtherCellStatus(cell, i, j)
    })
  }

  _eachCell(cb) {
    const fences = this.fenceGroup.fences
    for (let i = 0; i < fences.length; i++) {
      for (let j = 0; j < fences[i].cells.length; j++) {
        const cell = fences[i].cells[j]
        cb(cell, i, j)
      }
    }
  }

  _changeCellStatus(cell, x, y) {
    if (cell.status === CellStatus.WAITING) {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTED // 改变状态
      this.skuPending.insertCell(cell, x) // 记录选择
    } else if (cell.status === CellStatus.SELECTED) {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
      this.skuPending.removeCell(x)
    }
  }

  _changeOtherCellStatus(cell, x, y) {
    const path = this._findPotentialPath(cell, x)
    console.log(path)
    // 选中的 cell 不需要判断潜在路径
    if (!path) return

    // 潜在路径是否存在于路径字典中
    const pathExisted = this._isInPathDict(path)
    if (pathExisted) {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
    } else {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.FORBIDDEN
    }

  }

  /**
  * 当前 cell 的潜在路径为：当前 cell 路径 + 其他行已选中 cell 的路径
  * 当前选中的 cell 不需要判断潜在路径
  *
  * 举个例子：
  * A B C
  * D E F
  * G H I
  * 选中 E，则 A 的潜在路径有 AE，B 的潜在路径有 BE，C 的潜在路径有 CE，D 的潜在路径有 D，E 的潜在路径有 E，F 的潜在路径有 F，同理 G、H、I 的潜在路径有 EG EH EI
  */
  _findPotentialPath(cell, rowNum) { // 参数为 cell 以及该 cell 对应的行
    const fences = this.fenceGroup.fences
    const joiner = new Joiner('#')

    // cell 为选中状态时，不需要继续判断了，因为它已经被选中了，不需要潜在路径来进行字典判断了
    // 这里判断条件不能为 cell.status === CellStatus.SELECTED
    // 假如我选择了 E，E 为 selected，然后选择了 F，此时由于 _changeCellStatus 只会改变选中的那个 cell 而不会重置之前选择的 cell
    // 因此就会产生同一行选中两个的情况
    // 解决方法是使用 skuPending 类，用它来找到当前选择的 cell
    if (this.skuPending.isSelected(cell, rowNum)) return

    for (let i = 0; i < fences.length; i++) {
      // cell行 等于 遍历索引（当前行）时，加入自己的路径
      if (rowNum === i) {
        const cellCode = this._getCellCode(cell.spec)
        joiner.join(cellCode)
      } else {
        // cell行 不等于 遍历索引（当前行）时，检查是否有已选中 cell，有就加入已选中 cell 的路径
        const selectedCell = this.skuPending.findSelectedCellByX(i)
        if (selectedCell) {
          const selectedCellCode = this._getCellCode(selectedCell.spec)
          joiner.join(selectedCellCode)
        }
      }
    }

    return joiner.getStr()
  }

  _getCellCode(spec) {
    return `${spec.key_id}-${spec.value_id}`
  }

  _isInPathDict(path) {
    return this.pathDict.includes(path)
  }
}

export {
  Judger
}
