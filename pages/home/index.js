import { Theme } from '../../model/theme'
import { Banner } from '../../model/banner'
import { Category } from '../../model/category'
import { Activity } from '../../model/activity'
import { SpuPage } from '../../model/spu-page'
import { CouponCenterType } from '../../core/enum'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    paging: null,
    loadingType: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initialData()
  },

  async initSpuList () {
    const paging = await SpuPage.getLatestPaging()
    this.setData({ paging })
    const data = await paging.getMoreData()

    if (!data) return
    // 把数据传入瀑布流组件中
    // 不需要传累加后的数据，组件内部会自动累加
    wx.lin.renderWaterFlow(data.items)
  },

  async initialData () {
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const data = await this.data.paging.getMoreData()
    if (data) wx.lin.renderWaterFlow(data.items)
    if (!this.data.paging.moreData) {
      this.setData({ loadingType: 'end' })
    }
  },

  goCoupons(e) {
    const name = e.currentTarget.dataset.aname
    // 优惠券有两种类型，活动和分类，前者针对某个活动发放优惠券，后者针对某个类别的商品发放优惠券
    wx.navigateTo({
      url: `/pages/coupon/index?name=${name}&type=${CouponCenterType.ACTIVITY}`,
    })
  }
})
