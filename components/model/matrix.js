/**
 * 矩阵操作
 */

class Matrix {
  m = [] // 矩阵

  constructor(matrix) {
    this.m = matrix
  }

  // 行数
  get rowNum() {
    return this.m.length
  }

  // 列数
  get colNum() {
    return this.m[0].length
  }

  // 遍历矩阵元素(先遍历列，再遍历行)
  each(cb) {
    for (let j = 0; j < this.colNum; j++) {
      for (let i = 0; i < this.rowNum; i++) {
        const element = this.m[i][j]
        cb(element, i, j)
      }
    }
  }

  // 矩阵转置
  transpose() {
    const arr = []
    for (let j = 0; j < this.colNum; j++) {
      arr[j] = []
      for (let i = 0; i < this.rowNum; i++) {
        arr[j][i]= this.m[i][j]
      }
    }
    return arr
  }
}

export {
  Matrix
}
