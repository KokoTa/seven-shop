/**
 * 最终提交到服务端的订单数据
 */
class OrderPost {
  total_price
  final_total_price
  coupon_id
  sku_info_list = []
  address = {}

  constructor(totalPrice, finalTotalPrice, couponId, skuInfoList, address) {
      this.total_price = totalPrice // 订单总价
      this.final_total_price = finalTotalPrice // 订单总价优惠后的价格
      this.coupon_id = couponId
      this.sku_info_list = skuInfoList
      this._fillAddress(address)
  }

  _fillAddress(address) {
      this.address.user_name = address.userName
      this.address.national_code = address.nationalCode
      this.address.postal_code = address.postalCode
      this.address.city = address.cityName
      this.address.province = address.provinceName
      this.address.county = address.countyName
      this.address.detail = address.detailInfo
      this.address.mobile = address.telNumber
  }
}

export {
  OrderPost
}