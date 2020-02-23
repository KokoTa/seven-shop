import { Cell } from './cell';
/**
 * 记录路径
 */
import { SkuCode } from './sku-code';

class SkuPending {
  pending = []
  size

  constructor(size) {
    this.size = size
  }

  // 插入用户的选择，x 用于标识选择的行，一行只能选一项
  insertCell(cell, x) {
    this.pending[x] = cell
  }

  removeCell(x) {
    this.pending[x] = null
  }

  // 查找对应行已选择的项
  findSelectedCellByX(x) {
    return this.pending[x]
  }

  // 检查传入的 cell 是否被记录了
  isSelected(cell, x) {
    const pendingCell = this.pending[x]
    if (!pendingCell) return false
    return cell.id === pendingCell.id
  }

  // 初始化
  initSkuPending(sku) {
    sku.specs.forEach((s, x) => {
      const cell = new Cell(s)
      this.insertCell(cell, x)
    })
  }

  // 是否选择了完整的路径
  isIntact() {
    for (let i = 0; i < this.size; i++) {
      if (!this.pending[i]) {
        return false
      }
    }
    return true
  }

  // PS：该方法缺少了 spu id，在 judge 中补齐了
  getSkuPendingCode() {
    const specs = this.pending.map(cell => (cell && cell.spec) ? cell.spec : null)
    return SkuCode.getSkuCode(specs)
  }

  // 获取已选规格值
  getIntactSpecValues() {
    return this.pending.map((cell) => {
      return cell ? cell.spec.value : ''
    })
  }

  // 获取未选规格索引
  getMissingSpecKeysIndex() {
    let keyIndex = []
    for (let i = 0; i < this.size; i++) {
      if (!this.pending[i]) keyIndex.push(i)
    }
    return keyIndex
  }
}

export {
  SkuPending
}
