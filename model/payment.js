/**
 * 支付相关 API
 */

const { Http } = require("../utils/http");

class Payment {
  static async getPayParams(orderId) {
    return await Http.request({
      url: `/payment/pay/order/${orderId}`,
      method: 'POST',
    })
  }
}

export {
  Payment
}