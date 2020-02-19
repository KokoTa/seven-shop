import { CellStatus } from '../../core/enum';
/**
 * 规格单元
 */

class Cell {
  spec
  title
  id
  status = CellStatus.WAITING

  constructor(spec) {
    this.spec = spec
    this.title = spec.value
    this.id = spec.value_id
  }
}

export {
  Cell
}
