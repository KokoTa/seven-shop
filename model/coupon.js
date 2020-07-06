/**
 * 优惠券
 */
import {Http} from "../utils/http";

class Coupon {
    // 领取优惠券
    static async collectCoupon(cid) {
        return await Http.request({
            method: 'POST',
            url: `/coupon/collect/${cid}`,
            throwError: true
        })
    }

    // 根据状态获取我的优惠券
    static getMyCoupons(status) {
        return Http.request({
            url: `/coupon/myself/by/status/${status}`
        })
    }


    // 获取分类优惠券
    static async getCouponsByCategory(cid) {
        return await Http.request({
            url: `/coupon/by/category/${cid}`,
        })
    }

    // 获取我的优惠券(带对应的分类信息)
    static async getMySelfWithCategory() {
        return Http.request({
            url: `/coupon/myself/available/with_category`
        })
    }

    // 商品详情下，通过分类 ID 获取分类优惠券，如果分类下没有分类优惠券，那么就获取全场优惠券，优惠券只获取前两张
    static async getTop2CouponsByCategory(cid) {
        const coupons = await Http.request({
            url: `/coupon/by/category/${cid}`,
        })
        if (coupons.length === 0) {
            const otherCoupons = await Coupon.getWholeStoreCoupons()
            return Coupon.getTop2(otherCoupons)
        }
        if (coupons.length >= 2) {
            return coupons.slice(0, 2)
        }
        if (coupons.length === 1) {
            const otherCoupons = await Coupon.getWholeStoreCoupons()
            coupons = coupons.concat(otherCoupons)
            return Coupon.getTop2(coupons)
        }
    }

    static getTop2(coupons) {
        if (coupons.length === 0) {
            return []
        }
        if (coupons.length >= 2) {
            return coupons.slice(0, 2)
        }
        if (coupons.length === 1) {
            return coupons
        }
        return []
    }


    static async getWholeStoreCoupons() {
        return await Http.request({
            url: `/coupon/whole_store`
        })
    }
}

export {
    Coupon
}