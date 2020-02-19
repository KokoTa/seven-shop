/**
 * 记录路径
 */

class SkuPending {
  pending = []

  constructor() {

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
}

export {
  SkuPending
}
