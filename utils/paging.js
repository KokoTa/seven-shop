import { Http } from './http';

/**
 * 分页工具类
 *
 * 需要考虑的因素：
 * 1. 加载状态：正在加载、加载完成、没有更多数据
 * 2. 加载控制：防抖节流
 */
class Paging {

  req // 包含 url、data、method
  start // 索引
  count // 单位数量
  locker = false // true 已锁 false 未锁
  moreData = true // 是否有更多数据
  accumulator = []

  constructor(req, count = 10, start = 0) {
    this.req = req
    this.count = count
    this.start = start
  }

  // 获取更多数据
  async getMoreData() {
    if (this.locker || !this.moreData) return null
    const data = await this._actualGetData()
    this._releaseLocker()
    return data
  }

  // 获取数据
  async _actualGetData() {
    const { count, start } = this
    const { url, data, method } = this.req

    const result = await Http.request({
      url,
      method,
      data: {
        ...data,
        count,
        start
      }
    })

    const paging = result.data

    if (!paging) return null

    if (paging.total === 0) {
      return {
        empty: true,
        items: [],
        moreData: false,
        accumulator: []
      }
    }

    this._accumulate(paging.items)

    this.moreData = this._moreData(paging.total_page, paging.page)

    if (this.moreData) {
      this.start += this.count
    }

    return {
      empty: false,
      items: paging.items,
      moreData: this.moreData,
      accumulator: this.accumulator
    }

    // return {
    //   empty: false, // 是否为空
    //   items: [], // 请求得到的 item 集合
    //   moreData: true, // 是否有更多数据
    //   accumulator: [] // 累加后的d item 集合
    // }
  }

  // 累加
  _accumulate(items) {
    this.accumulator = this.accumulator.concat(items)
  }

  // 通过页码判断是否有更多数据
  // 注意这里 pageNum 从 0 开始计算
  _moreData(totalPage, pageNum) {
    return pageNum <  totalPage - 1
  }

  // 加锁
  _getLocker() {
    if (this.locker) {
      return false
    }
    this.locker = true
    return true
  }

  // 解锁
  _releaseLocker() {
    this.locker = false
  }
}

export { Paging }
