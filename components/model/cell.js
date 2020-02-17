/**
 * 规格单元
 */

class Cell {
  title
  id

  constructor(spec) {
    this.title = spec.value
    this.id = spec.value_id
  }
}

export {
  Cell
}
