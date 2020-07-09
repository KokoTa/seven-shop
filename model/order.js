/**
 * 订单相关的请求
 */

import { Http } from "../utils/http"

class OrderRequest {
  static async  postOrderToServer(orderPost) {
    return await Http.request({
      url: '/order',
      method: 'post',
      data: orderPost,
      throwError: true
    })
  }
}

export {
  OrderRequest
}