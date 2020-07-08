import { CouponType } from "../../core/enum"
import { accSubtract, accMultiply, accAdd } from "../../utils/number"

/**
 * 优惠券逻辑类
 */
class CouponBO {
  coupon
  
  constructor(coupon) {
    this.coupon = coupon // PS：偷懒，直接赋值数据库的数据，数据库的数据是下划线分隔符
    this.coupon.category_ids = this.coupon.categories.map((c) => c.id)
  }

  // 优惠券和订单作比较，赋值一个 satisfaction 变量
  // 1. 优惠券如果是全场券，可以直接使用该优惠券
  // 2. 优惠券如果是分类优惠券，要筛选出对应分类的商品，计算它们的总价后比较得出是否可以使用该优惠券
  meetingCondition(order) {
    const coupon = this.coupon
    let categoryTotalPrice = 0

    if (coupon.whole_store) {
      // 全场券
      categoryTotalPrice = order.getTotalPrice()
    } else {
      // 分类券
      categoryTotalPrice = order.getTotalPriceByCategory(this.coupon.category_ids)
    }

    let satisfaction = false

    switch(coupon.type) {
      case CouponType.FULL_MINUS:
      case CouponType.FULL_OFF:
        satisfaction = this._fullTypeCouponIsOk(categoryTotalPrice)
        break
      case CouponType.NO_THRESHOLD_MINUS:
        satisfaction = true
        break
      default:
        break
    }

    coupon.satisfaction = satisfaction
  }

  // 是否符合满减规则
  _fullTypeCouponIsOk(categoryTotalPrice) {
    if (categoryTotalPrice >= this.coupon.full_money) return true
    return false
  }

  // 获取用完优惠券后的总价格
  static getUseCouponFinalPrice(orderPrice, coupon) {
    if (coupon.satisfaction === false) throw new Error('优惠券不满足条件')

    let finalPrice = 0
    switch(coupon.type) {
      case CouponType.FULL_MINUS:
      case CouponType.NO_THRESHOLD_MINUS:
        finalPrice = accSubtract(orderPrice, coupon.minus)
        return {
          finalPrice: finalPrice < 0 ? 0 : finalPrice,
          discountPrice: coupon.minus
        }
      case CouponType.FULL_OFF:
        const price = accMultiply(orderPrice, coupon.rate) // 可能算出来的值精度有四位
        finalPrice = this.roundMoney(price) // 向上取整，精度为两位
        return {
          finalPrice,
          // 这里不能这样做，因为保留两位小数，如果都用 rate 计算，两者相加会发生不等于总价的情况
          // discountPrice: accMultiply(orderPrice, accSubtract(1, coupon.rate)) 
          discountPrice: accSubtract(orderPrice, finalPrice)
        }
      default: 
        return null
    }
  }

  // 满减折扣，使用向上取整，这里的规则和服务器要一样，不然订单校验会不通过
  // 对于小数的约束模式有 4 种：向上/下取整、四舍五入、银行家模式(四舍六入)
  static roundMoney(money) {
    return Math.ceil(money * 100) / 100
  }
}

export {
  CouponBO
}