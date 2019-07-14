// 服务器的每个返回应该都要带时间戳

const getServerTime = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(Date.now())
    }, 100);
  })
}

exports.default = {
  getServerTime
}