/**
 * 路径拼接
 */

class Joiner {
  str = ''
  symbol = '-'
  cutCharNum = 1

  constructor(symbol, cutCharNum) {
    if (symbol) this.symbol = symbol
    if (cutCharNum) this.cutCharNum = cutCharNum
  }

  join(part) {
    if (part) this.str += `${part}${this.symbol}`
  }

  getStr() {
    return this.str.slice(0, this.str.length - this.cutCharNum)
  }
}

export {
  Joiner
}
