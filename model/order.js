/**
 * 订单相关的请求
 */

import { Http } from "../utils/http"
import { OrderStatus } from "../core/enum"
import { Paging } from "../utils/paging"

class OrderRequest {

  // 提交订单
  static async postOrderToServer(orderPost) {
    return await Http.request({
      url: '/order',
      method: 'post',
      data: orderPost,
      throwError: true
    })
  }

  // 获取待支付数量
  static async getUnpaidCount() {
    const orderPage = await Http.request({
      url: `/order/by/status/${OrderStatus.PAID}`,
      data: {
        start: 0,
        count: 1
      }
    })
    return orderPage.total
  }

  // 获取待发货数量
  static async getPaidCount() {
    const orderPage = await Http.request({
      url: `/order/status/unpaid`,
      data: {
        start: 0,
        count: 1
      }
    })
    return orderPage.total
  }

  // 获取待收货数量
  static async getDeliveredCount() {
    const orderPage = await Http.request({
      url: `/order/by/status/${OrderStatus.DELIVERED}`,
      data: {
        start: 0,
        count: 1
      }
    })
    return orderPage.total
  }

  // 获取对应状态的订单
  static getPagingByStatus(status) {
    return new Paging({
        url:`/order/by/status/${status}`
    })
  }

  // 获取未支付订单
  static getPagingUnpaid() {
    return new Paging({
      url: `/order/status/unpaid`
    })
  }
}

export {
  OrderRequest
}