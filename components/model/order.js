import { OrderException, OrderExceptionType } from "../../core/enum"

/**
 * 订单类
 */
class Order {
  orderItems
  localItemCount

  constructor(orderItems, localItemCount) {
    this.orderItems = orderItems // 服务端商品数量
    this.localItemCount = localItemCount // 本地商品数量
  }

  checkOrderIsOk() {
    this.orderItems.forEach((order) => {
      order.isCountOk()
      this._isEmpty()
      this._isNoSale()
    })
  }

  _isEmpty() {
    if (this.orderItems.length === 0) {
      throw new OrderException('订单中没有任何商品', OrderExceptionType.EMPTY)
    }
  }

  _isNoSale() {
    if (this.orderItems.length !== this.localItemCount) {
      throw new OrderException('服务器返回订单商品数量与实际不相符，可能是有商品已下架', OrderExceptionType.NOT_ON_SALE)
    }
  }
}

export {
  Order
}