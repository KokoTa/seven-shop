// components/coupon/index.js
// import {Coupon} from "../../models/coupon";
import {showToast} from "../../utils/ui";
import {CouponData} from "./coupon-data";
import {CouponStatus} from "../../core/enum";
import {Coupon} from "../../model/coupon";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        coupon: Object,
        status: {
            type: Number,
            value: CouponStatus.CAN_COLLECT
        }
    },

    data: {
        _coupon: Object,
        _status: CouponStatus.CAN_COLLECT,
        userCollected: false
    },

    observers: {
        'coupon': function (coupon) {
            console.log(coupon)
            if (!coupon) {
                return
            }
            this.setData({
                _coupon: new CouponData(coupon),
            })
        }
    },

    methods: {
        async onGetCoupon(event) {
            if (this.data.userCollected) {
                wx.switchTab({
                    url: `/pages/category/index`
                })
                return
            }

            const couponId = event.currentTarget.dataset.id
            let msg = null
            
            try {
                msg = await Coupon.collectCoupon(couponId)
            } catch(err) {
                const error = JSON.parse(err.message)
                showToast(error.message)
                this.setUserCollected()
                return
            }

            if (msg.data.code === 200) {
                showToast('领取成功，在"我的优惠券"中查看')
                this.setUserCollected()
            }
        },

        setUserCollected() {
            this.setData({
                _status: CouponStatus.AVAILABLE,
                userCollected: true
            })
        }
    }

})
