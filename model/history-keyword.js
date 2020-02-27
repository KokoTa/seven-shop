
class HistoryKeyword {
  static MAX_ITEM_COUNT = 20

  static KEYWORDS = 'keywords'

  keywords = []

  constructor () {
    this.keywords = this._getFromLocal()
  }

  save (keyword) {
    const existed = this.keywords.indexOf(keyword) !== -1
    if (existed) return
    if (this.keywords.length >= HistoryKeyword.MAX_ITEM_COUNT) {
      this.keywords.pop()
    }
    this.keywords.unshift(keyword)
    this._setToLocal()
  }

  get () {
    return this.keywords
  }

  clear () {
    this.keywords = []
    this._setToLocal()
  }

  _setToLocal () {
    wx.setStorageSync(HistoryKeyword.KEYWORDS, this.keywords)
  }

  _getFromLocal () {
    const keywords = wx.getStorageSync(HistoryKeyword.KEYWORDS)
    return keywords || []
  }
}

export {
  HistoryKeyword
}
