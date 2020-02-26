import { promisic } from '../miniprogram_npm/lin-ui/utils/util';

const getSystemInfo = async function () {
  const res = await promisic(wx.getSystemInfo)()
  return res
}

export {
  getSystemInfo
}
