import { HistoryKeyword } from '../../model/history-keyword'
// pages/search/index.js
import { Tag } from '../../model/tag'
import { Search } from '../../model/search'
const history = new HistoryKeyword()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyTags: [],
    hotTags: [],
    searchFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const historyTags = history.get()
    this.setData({ historyTags })

    const hotTags = await Tag.getHotTags()
    this.setData({ hotTags })
  },

  onSearch (e) {
    const keyword = e.detail.value || e.detail.name
    if (!keyword || !keyword.trim()) {
      wx.showToast({
        title: '输入内容不能为空',
        icon: 'none'
      })
      return
    }
    history.save(keyword)
    const historyTags = history.get()
    this.setData({ historyTags, searchFlag: true })

    this.data.paging = Search.search(keyword)
    wx.lin.renderWaterFlow([], true)
    this._getMoreData()
  },

  onCancel () {
    this.setData({ searchFlag: false })
  },

  onDelHistory () {
    history.clear()
    const historyTags = history.get()
    this.setData({ historyTags })
  },

  onReachBottom: async function () {
    this._getMoreData()
  },

  async _getMoreData () {
    const data = await this.data.paging.getMoreData()
    if (data) wx.lin.renderWaterFlow(data.items)
    if (!this.data.paging.moreData) {
      this.setData({ loadingType: 'end' })
    }
  }
})
