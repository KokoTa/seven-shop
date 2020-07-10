import { Cart } from "../../components/model/cart"
import { Sku } from "../../model/sku"
import { OrderItem } from "../../components/model/order-item"
import { Order } from "../../components/model/order"
import { Coupon } from "../../model/coupon"
import { CouponBO } from "../../components/model/couponBO"
import { CouponOperate, ShoppingWay } from "../../core/enum"
import { showToast } from "../../utils/ui"
import { OrderPost } from "../../components/model/order-post"
import { OrderRequest } from "../../model/order"
import { Payment } from "../../model/payment"

const cart = new Cart()

// pages/order/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: null,
    orderItems: [],
    couponBOList: [],
    order: null,
    totalPrice: 0,
    finalTotalPrice: 0,
    discountPrice: 0,
    currentCouponId: null,
    submitBtnDisable: false,

    loading: true,
    shoppingWay: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const shoppingWay = options.way // 从购物车进来的话，下单的时候要删除购物车中已选择的项。从商品详情点击立即购买进来的，不需要操作购物车
    this.setData({ shoppingWay })

    const address = wx.getStorageSync('address')
    if (address) this.setData({ address })

    let skuIds = []
    let orderItems = []
    let localItemCount = 0
    if (shoppingWay === ShoppingWay.CART) {
      // 这里不获取缓存中的 sku 项，而是获取 sku id 数组，从服务端那边同步数据，因为缓存的数据可能不是最新的
      skuIds = cart.getCheckedSkuIds()
      orderItems = await this.getCartOrderItems(skuIds)
      localItemCount = skuIds.length
    } else if (shoppingWay === ShoppingWay.BUY) {
      const skuId = options.skuId
      const count = options.count
      orderItems = await this.getBuyOrderItems(skuId, count)
      localItemCount = 1
    }

    const order = new Order(orderItems, localItemCount)
    const totalPrice = order.getTotalPrice() // 还未用优惠券时的订单价格

    try {
      order.checkOrderIsOk()
      this.setData({
        order,
        orderItems,
        totalPrice,
        finalTotalPrice: totalPrice
      })
    } catch (err) {
      showToast(err)
      console.log(err)
      return
    }

    // 获取我的优惠券数据
    const couponBOList = await this.getCoupons(order)
    this.setData({
      couponBOList
    })

    // 关闭骨架屏
    this.setData({
      loading: false
    })
  },

  async getCartOrderItems(skuIds) {
    // 同步最新 SKU 数据，下架的商品不会返回
    const checkedSkus = await Sku.getSkuByIds(skuIds)
    const checkedItems = cart.getCheckedItems()

    let orderItems = []
    checkedSkus.forEach((sku) => {
      checkedItems.forEach((item) => {
        if (sku.id === item.skuId) {
          orderItems.push(new OrderItem(sku, item.count))
        }
      })
    })

    return orderItems
  },

  async getBuyOrderItems(skuId, count) {
    const skus = await Sku.getSkuByIds(skuId)
    return [new OrderItem(skus[0], count)]
  },

  async getCoupons(order) {
    const coupons = await Coupon.getMySelfWithCategory()
    return coupons.map((coupon) => {
      const couponBO = new CouponBO(coupon)
      couponBO.meetingCondition(order) // 判断该优惠券是否可用，会赋值一个 satisfaction 属性
      return couponBO
    })
  },

  // 优惠券选择
  onChooseCoupon(e) {
    const {
      coupon,
      operate
    } = e.detail
    console.log(coupon, operate)

    if (operate === CouponOperate.PICK) { // 如果有选择优惠券
      const priceObj = CouponBO.getUseCouponFinalPrice(this.data.order.getTotalPrice(), coupon)
      this.setData({
        finalTotalPrice: priceObj.finalPrice,
        discountPrice: priceObj.discountPrice,
        currentCouponId: coupon.id
      })
    } else {
      this.setData({
        finalTotalPrice: this.data.order.getTotalPrice(),
        discountPrice: 0,
        currentCouponId: null
      })
    }
  },

  // 获取地址
  onChooseAddress(event) {
    const address = event.detail.address
    this.setData({
      address
    })
  },

  // 提交订单，需要做按钮禁用
  async onSubmit() {
    if (!this.data.address) {
      showToast('请选择收货地址')
      return
    }

    // 提交禁用
    this.setData({
      submitBtnDisable: true
    })

    const {
      totalPrice,
      finalTotalPrice,
      currentCouponId,
      address,
      order
    } = this.data
    const orderPost = new OrderPost(
      totalPrice,
      finalTotalPrice,
      currentCouponId,
      order.getOrderSkuInfoList(),
      address
    )
    console.log(orderPost)

    // 提交订单到服务器
    let oid = null
    try {
      // const res = await OrderRequest.postOrderToServer(orderPost)
      const res = { id: 325 }
      if (!res.id) {
        showToast(res.message)
        this.setData({ submitBtnDisable: false })
        return
      }
      oid = res.id
    } catch (e) { // 这里能获取 404 等 http 错误是因为对 Http 类进行了包装
      showToast(e.message)
      this.setData({ submitBtnDisable: false })
      return
    }

    // 购物车进入订单页时，下单后要移除选中的购物车商品
    if (this.data.shoppingWay === ShoppingWay.CART) {
      // cart.removeCheckedItems()
    }

    // 为了防止用户重复点击下单，使用了全屏 loading
    wx.lin.showLoading({
      type: 'flash',
      fullScreen: true,
      color: '#157658'
    })

    // 调用支付：调用后端支付 API -> 获取 params 参数 -> 调用 wx.requestPayment -> 二维码扫描 -> 获取支付回调 -> 跳转页面
    // const params = await Payment.getPayParams(oid)
    try {
      // const result = await wx.requestPayment(params)
      const result = { errMsg: 'requestPayment:ok' } // 支付成功
      wx.redirectTo({ // 用 redirectTo，调用支付后不能再回到订单页
        url: `/pages/order-detail/index?oid=${oid}`,
      })
    } catch (e) {
      const error = { errMsg: 'requestPayment:fail cancel' } // 支付取消/失败
      const payStatus = 1
      wx.redirectTo({
        url: `/pages/my-order/index?key=${1}`, // 传参为订单状态
      })
    }

    this.setData({ submitBtnDisable: false })
  }
})
