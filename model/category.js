import { Http } from '../utils/http'

class Category {
  roots = [] // 一级分类
  subs = [] // 二级分类

  // 获取所有分类数据
  async getAllCategories () {
    const data = await Http.request({
      url: '/category/all'
    })
    this.roots = data.data.roots
    this.subs = data.data.subs
  }

  getRoots () {
    return this.roots
  }

  getSubs (rootId) {
    return this.subs.filter(s => s.parent_id === rootId)
  }

  // 获取首页九宫格数据
  static async getHomeLocationC () {
    const data = await Http.request({
      url: '/category/grid/all'
    })
    return data.data
  }
}

export { Category }
