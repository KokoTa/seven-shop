import { Theme } from '../../model/theme'
import { Banner } from '../../model/banner'
import { Category } from '../../model/category'
import { Activity } from '../../model/activity';
import { SpuPage } from '../../model/spu-page';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    themeA: '',
    bannerB: [],
    grid: [],
    activityD: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initialData()
  },

  async initSpuList() {
    const paging = await SpuPage.getLatestPaging()
    const data = paging.getMoreData()

    if (!data) return
  },

  async initialData() {
    const theme = new Theme()
    await theme.getThemes()

    const themeA = theme.getHomeLocationA()
    const themeE = theme.getHomeLocationE()
    // 判断是否是上架状态
    let themeESpu = []
    if (themeE.online) {
      const data = await Theme.getHomeLocationESpu()
      if (data) {
        themeESpu = data.spu_list.slice(0, 8)
      }
    }
    const themeF = theme.getHomeLocationF()
    const themeH = theme.getHomeLocationH()
    const bannerB = await Banner.getHomeLocationB()
    const bannerG = await Banner.getHomeLocationG()
    const gridC = await Category.getHomeLocationC()
    const activityD = await Activity.getHomeLocationD()

    this.initSpuList()

    this.setData({
      themeA,
      bannerB: bannerB.items,
      gridC,
      activityD,
      themeE,
      themeESpu,
      themeF,
      bannerG,
      themeH
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
})
