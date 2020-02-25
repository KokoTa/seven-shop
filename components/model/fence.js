import { Cell } from './cell';
/**
 * 规格行
 */

class Fence {
  specs = []
  cells = []

  title
  id

  constructor(specs) {
    this.specs = specs
    this.title = specs[0].key
    this.id = specs[0].key_id
  }

  init() {
    this._initCells()
  }

  setCellSkuImg(skuList) {
    this.cells.forEach(cell => {
      const cellCode = Cell.getCellCode(cell.spec)
      skuList.forEach(sku => {
        if (sku.code.indexOf(cellCode) !== -1) {
          cell.skuImg = sku.img
        }
      })
    })
  }

  _initCells() {
    this.specs.forEach((spec) => {
      const existed = this.cells.some(cell => {
        return cell.id === spec.value_id
      })

      if (!existed) {
        const cell = new Cell(spec)
        this.cells.push(cell)
      }
    })
  }
}

export {
  Fence
}
