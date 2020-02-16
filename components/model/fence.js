import { Cell } from './cell';
/**
 * 规格行
 */

class Fence {
  specs = []
  cells = []

  constructor(spec) {
    this.specs = spec
    this.init()
  }

  init() {
    this.specs.forEach(spec => {
      const cell = new Cell(spec)
      this.cells.push(cell)
    })
  }
}

export {
  Fence
}
