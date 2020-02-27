import { Http } from '../utils/http'
/**
 * 标签
 */

class Tag {
  static async getHotTags () {
    const data = await Http.request({
      url: '/tag/type/1'
    })
    return data.data
  }
}

export {
  Tag
}
