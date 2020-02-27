const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 组合算法
const combination = function (arr1, num) {
  var result = []
  var range = function (r, arr2) {
    if (r.length == num) {
      result.push(r)
    } else {
      const l = r.length
      const len = arr2.length - num + l
      for (let i = 0; i <= len; i++) {
        range(r.concat(arr2[i]), arr2.slice(i + 1))
      }
    }
  }
  range([], arr1)
  return result
}

module.exports = {
  formatTime: formatTime,
  combination: combination
}
