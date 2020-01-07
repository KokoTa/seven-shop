import { Paging } from '../utils/paging';

class SpuPage {
  static getLatestPaging() {
    return new Paging({
      url: '/spu/latest'
    }, 3)
  }
}

export { SpuPage }