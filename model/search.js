import { Paging } from '../utils/paging'
/**
 * 搜索
 */
class Search {
  static search (q) {
    return new Paging({
      url: `/search?q=${q}`
    })
  }
}

export {
  Search
}
