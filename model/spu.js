import { Http } from '../utils/http';


class Spu {
  static getDetail(id) {
    return Http.request({
      url: `/spu/id/${id}/detail`
    }).then(res => res.data)
  }
}

export {
  Spu
}
