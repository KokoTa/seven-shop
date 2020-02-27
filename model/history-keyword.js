
class HistoryKeyword {
  static MAX_ITEM_COUNT = 20

  static KEYWORDS = 'keywords'

  keywords = []

  save (keyword) {
    const existed = this.keywords.indexOf(keyword) !== -1
    if (existed) return
    if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
      this.keywords.pop()
    }
    this.keywords.unshift(keyword)
  }

  get () {
    return this.keywords
  }

  clear () {
    this.keywords = []
  }

  _setToLocal () {
    wx.setStorageSync(HistoryKeyword.KEYWORDS, this.keywords)
  }
}

export {
  HistoryKeyword
}
