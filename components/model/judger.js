/**
 * 数据判断与操作类
 * 拆解 SKU，检查路径
 */
import { SkuCode } from './sku-code'
import { CellStatus } from '../../core/enum'
import { SkuPending } from './sku-pending'
import { Joiner } from '../../utils/joiner'
import { Cell } from './cell'

class Judger {
  fenceGroup
  pathDict = []
  skuPending

  constructor (fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initPathDict()
    this._initSkuPending()
  }

  // 初始化字典路径
  _initPathDict () {
    this.fenceGroup.spu.sku_list.forEach(item => {
      const skuCode = new SkuCode(item.code)
      this.pathDict.push(...skuCode.totalSegments)
    })
  }

  // 初始化默认记录
  _initSkuPending () {
    const fencesLength = this.fenceGroup.fences.length
    const skuPending = new SkuPending(fencesLength)
    this.skuPending = skuPending
    // 检查是否有默认记录，有的话就插入记录，然后更改默认记录的 cell 状态为 selected，最后进行潜在路径判断
    const defaultSku = this.fenceGroup.getDefaultSku()
    if (!defaultSku) return
    this.skuPending.initSkuPending(defaultSku)
    this.skuPending.pending.forEach(cell => this.fenceGroup.setCellStatusById(cell.id, CellStatus.SELECTED))
    this.judge({}, true)
  }

  judge ({ cell, x, y }, isInit = false) {
    // 如果不是初始化默认记录，则说明是用户点击 cell 触发了该函数
    if (!isInit) {
      // 改变点击的 cell 的状态
      this._changeCellStatus(cell, x, y)
    }
    // 改变其他 cell 的状态
    this._eachCell((cell, i, j) => {
      this._changeOtherCellStatus(cell, i, j)
    })
  }

  _eachCell (cb) {
    const fences = this.fenceGroup.fences
    for (let i = 0; i < fences.length; i++) {
      for (let j = 0; j < fences[i].cells.length; j++) {
        const cell = fences[i].cells[j]
        cb(cell, i, j)
      }
    }
  }

  _changeCellStatus (cell, x, y) {
    if (cell.status === CellStatus.WAITING) {
      this.fenceGroup.setCellStatusByXY(x, y, CellStatus.SELECTED) // 改变状态
      this.skuPending.insertCell(cell, x) // 记录选择
    } else if (cell.status === CellStatus.SELECTED) {
      this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
      this.skuPending.removeCell(x)
    }
  }

  _changeOtherCellStatus (cell, x, y) {
    // 查找潜在路径
    const path = this._findPotentialPath(cell, x)
    // console.log(path)
    // 选中的 cell _findPotentialPath 会返回 undefined，不需要改变状态
    if (!path) return

    // 潜在路径是否存在于路径字典中
    const pathExisted = this._isInPathDict(path)
    if (pathExisted) {
      this.fenceGroup.setCellStatusByXY(x, y, CellStatus.WAITING)
    } else {
      this.fenceGroup.setCellStatusByXY(x, y, CellStatus.FORBIDDEN)
    }
  }

  /**
  * 当前 cell 的潜在路径为：当前 cell 路径 + 其他行已选中 cell 的路径
  * 选中的 cell 不需要查找潜在路径，不需要改变状态，因为它本事就是存在于路径字典中
  *
  * 举个例子：
  * A B C
  * D E F
  * G H I
  * 选中 E，则 A 的潜在路径有 AE，B 的潜在路径有 BE，C 的潜在路径有 CE，D 的潜在路径有 D，E 的潜在路径有 E，F 的潜在路径有 F，同理 G、H、I 的潜在路径有 EG EH EI
  */
  _findPotentialPath (cell, rowNum) { // 参数为 cell 以及该 cell 对应的行
    const fences = this.fenceGroup.fences
    const joiner = new Joiner('#')

    // cell 为选中状态时，不用继续判断，因为它已经被选中了，说明它本事存在于路径字典中
    // PS：这里判断条件不能为 cell.status === CellStatus.SELECTED。假如我选择了 E，E 为 selected，然后选择了 F，此时由于 _changeCellStatus 只会改变选中的那个 cell 而不会重置之前选择的 cell，会产生同一行选中两个的情况。解决方法是使用 skuPending 类，用它来找到当前选择的 cell
    if (this.skuPending.isSelected(cell, rowNum)) return

    for (let i = 0; i < fences.length; i++) {
      // cell行 等于 遍历索引（当前行）时，加入自己的路径
      if (rowNum === i) {
        const cellCode = Cell.getCellCode(cell.spec)
        joiner.join(cellCode)
      } else {
        // cell行 不等于 遍历索引（当前行）时，检查是否有已选中 cell，有就加入已选中 cell 的路径
        const selectedCell = this.skuPending.findSelectedCellByX(i)
        if (selectedCell) {
          const selectedCellCode = Cell.getCellCode(selectedCell.spec)
          joiner.join(selectedCellCode)
        }
      }
    }

    return joiner.getStr()
  }

  _isInPathDict (path) {
    return this.pathDict.includes(path)
  }

  // 是否选择了一条完整路径
  isSkuIntact () {
    return this.skuPending.isIntact()
  }

  // 获取 sku
  getDeterminateSku () {
    const code = this.skuPending.getSkuPendingCode()
    const fullCode = `${this.fenceGroup.spu.id}$${code}`
    const sku = this.fenceGroup.spu.sku_list.find(sku => sku.code === fullCode)
    return sku || null
  }

  // 获取未选的规格名
  getMissingSpecKeys () {
    const missingIndex = this.skuPending.getMissingSpecKeysIndex()
    return missingIndex.map((index) => {
      return this.fenceGroup.fences[index].title
    })
  }

  // 获取已选择的规格值
  getIntactSpecValues () {
    return this.skuPending.getIntactSpecValues()
  }
}

export {
  Judger
}
