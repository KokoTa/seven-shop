import { Http } from './http';

/**
 * 分页工具类
 */
class Paging {

  req // 可能包含 url/data/method
  start
  count
  locker = false // true 已锁 false 未锁
  moreData = true
  accumulator = []

  constructor(req, count = 10, start = 0) {
    this.req = req
    this.count = count
    this.start = start
  }

  async getMoreData() {
    if (!this._getLocker || !this.moreData) return
    const data = await this._actualGetData()
    this._releaseLocker()
    return data
  }

  // 获取数据
  async _actualGetData() {
    const { count, start } = this

    const paging = await Http.request({
      ...this.req,
      data: {
        ...this.req.data,
        count,
        start
      }
    })

    if (!paging) return null

    if (paging.total === 0) {
      return {
        empty: true,
        items: [],
        moreData: false,
        accumulator: []
      }
    }

    this.moreData = this._moreData(paging.totalPage, paging.page)

    if (this.moreData) {
      this.start += this.count
    }

    this._accumulate(paging.items)

    return {
      empty: true,
      items: paging.items,
      moreData: this.moreData,
      accumulator: []
    }

    // return {
    //   empty: false, // 压根就没有数据
    //   items: [], // 请求得到的 item 集合
    //   moreData: true, // 是否有更多数据
    //   accumulator: [] // 当前已存在的 item 集合
    // }
  }

  // 累加
  _accumulate(items) {
    this.accumulator = this.accumulator.concat(items)
  }

  // 通过页码判断是否有更多数据
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