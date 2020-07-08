import { OrderException, OrderExceptionType } from "../../core/enum"
import { accAdd } from "../../utils/number"

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

  // 检查订单中商品库存、数量、销售状态
  checkOrderIsOk() {
    this.orderItems.forEach((orderItem) => {
      orderItem.isCountOk()
      this._isEmpty()
      this._isNoSale()
    })
  }

  // 获取订单中所有商品的总价
  getTotalPrice() {
    return this.orderItems.reduce((prev, orderItem) => {
      const price = accAdd(prev, orderItem.finalPrice)
      return price
    }, 0)
  }

  // 获取订单中多个分类下的商品总价
  getTotalPriceByCategory(categoryIdList = []) {
    if (categoryIdList.length === 0) return 0
    const price = categoryIdList.reduce((prev, cid) => {
      const eachPrice = this.getTotalPriceEachCategory(cid)
      return accAdd(prev, eachPrice)
    }, 0)
    return price
  }

  // 获取单个分类的下的商品总价
  getTotalPriceEachCategory(cid) {
    const price = this.orderItems.reduce((prev, orderItem) => {
      if (orderItem.categoryId === cid || orderItem.rootCategoryId === cid) {
        return accAdd(prev, orderItem.finalPrice)
      }
      return prev
    }, 0)
    return price
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