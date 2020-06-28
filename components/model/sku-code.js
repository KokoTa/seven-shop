import { combination } from '../../utils/util'
import { Cell } from './cell'
import { Joiner } from '../../utils/joiner'

/**
 * 处理 SKU code
 */

class SkuCode {
  code
  spuId
  totalSegments = [] // 当前 SKU 的所有规格路径

  constructor (code) {
    this.code = code
    this._splitToSegments()
  }

  _splitToSegments () {
    // 2$1-44#3-9#4-14
    // 2 表示 spu id
    // $ # 是分隔符
    // 1-44 是 spec 数组中的一项，是 key id - value id

    const spuAndSpec = this.code.split('$')

    const spuId = spuAndSpec[0]
    this.spuId = spuId

    const specCodeArray = spuAndSpec[1].split('#')

    // 找出所有规格组合(路径)
    for (let i = 1; i <= specCodeArray.length; i++) {
      const segments = combination(specCodeArray, i)
      // 还原成类似 1-11#2-22 的字符串
      const newSegments = segments.map(seg => {
        return seg.join('#')
      })
      this.totalSegments.push(...newSegments)
    }
  }

  // PS：该方法缺少了 spu id
  static getSkuCode (specs) {
    const joiner = new Joiner('#')
    specs.forEach(spec => {
      if (spec) {
        const cellCode = Cell.getCellCode(spec)
        joiner.join(cellCode)
      }
    })
    return joiner.getStr()
  }
}

export {
  SkuCode
}
