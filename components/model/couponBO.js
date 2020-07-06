/**
 * 优惠券逻辑类
 */
class CouponBO {
  coupon
  
  constructor(coupon) {
    this.coupon = coupon
    this.coupon.category_ids = this.coupon.categories.map((c) => c.id)
  }
}

export {
  CouponBO
}