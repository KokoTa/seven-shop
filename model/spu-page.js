import { Paging } from '../utils/paging';

class SpuPage {
  static getLatestPaging() {
    return new Paging({ // 实例化一个分页对象
      url: '/spu/latest'
    }, 10)
  }
}

export { SpuPage }