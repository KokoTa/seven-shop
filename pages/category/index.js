import { getSystemInfo } from '../../utils/system';
// pages/category/index.js
import { px2rpx } from '../../miniprogram_npm/lin-ui/utils/util';
import { Category } from '../../model/category';
import { SpuListType } from '../../core/enum';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    defaultRootId: 2,
    category: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSegmentHeight()
    this.initCategoryData()
  },

  async setSegmentHeight() {
    const info = await getSystemInfo()
    const windowHeightRpx = px2rpx(info.windowHeight)
    const height = windowHeightRpx - 60 - 20 -2
    this.setData({ height })
  },

  async initCategoryData() {
    this.category = new Category()
    await this.category.getAllCategories()
    const roots = this.category.getRoots()
    const defaultRoot = this.getDefaultRoot(roots)
    const currentSubs = this.category.getSubs(defaultRoot.id)

    this.setData({
      roots,
      currentSubs,
      currentBannerImg: defaultRoot.img
    })
  },

  getDefaultRoot(roots) {
    const defaultRoot = roots.find(r => r.id === this.data.defaultRootId)
    if (!defaultRoot) {
      defaultRoot = roots[0]
    }
    return defaultRoot
  },

  onGoToSearch() {
    wx.navigateTo({
      url: '/pages/search/index'
    })
  },

  onSegmentChange(e) {
    const rootId = e.detail.activeKey
    const roots = this.category.getRoots()
    const root = roots.find(r => r.id === +rootId)
    if (root) {
      const currentSubs = this.category.getSubs(root.id)
      this.setData({
        currentSubs,
        currentBannerImg: root.img
      })
    }
  },

  onGridItemTap(e) {
    const id = e.detail.id
    wx.navigateTo({
      url: `/pages/spu-list/index?id=${id}&type=${SpuListType.SUB_CATEGORY}`
    })
  }
})
