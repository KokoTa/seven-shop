import { CellStatus } from '../../core/enum';
/**
 * 规格单元
 */

class Cell {
  spec
  title
  id
  status = CellStatus.WAITING
  skuImg

  constructor(spec) {
    this.spec = spec
    this.title = spec.value
    this.id = spec.value_id
  }

  static getCellCode(spec) {
    return `${spec.key_id}-${spec.value_id}`
  }
}

export {
  Cell
}
