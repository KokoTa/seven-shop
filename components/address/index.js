import { AuthAddress } from "../../core/enum"

// components/address/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    address: null,
    hasChosen: false,
    showDialog: false
  },

  // 检查是否有缓存地址，有就显示
  lifetimes: {
    attached() {
      const address = wx.getStorageSync('address')
      if (address) {
        this.setData({ address, hasChosen: true })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async onChooseAddress() {
      const authStatus = await this.hasAddressPermission() // 获取授权情况
      if (authStatus === AuthAddress.DENY) { // 授权拒绝时跳到授权管理页
        this.setData({ showDialog: true })
        return
      }
      this.getAddress() // 授权允许时获取地址
    },
    async getAddress() {
      let res = null

      try {
        res = await wx.chooseAddress()
      } catch (e) {
        this.hasAddressPermission()
        console.error(e)
      }

      if (res) {
        this.setData({
          address: res,
          hasChosen: true
        })
        wx.setStorageSync('address', res)
        this.triggerEvent('address', { address: res })
      }
    },
    async onDialogConfirm() {
      wx.openSetting()
    },

    // 检测用户授权地址情况
    async hasAddressPermission() {
      const setting = await wx.getSetting()
      const addressSetting = setting.authSetting['scope.address']
      if (addressSetting === undefined) {
        return AuthAddress.NOT_AUTH
      }
      if (addressSetting === true) {
        return AuthAddress.AUTHORIZED
      }
      if (addressSetting === false) {
        return AuthAddress.DENY
      }
    }
  }
}) 
