/**
 * 根据目标位置 获取旋转角度
 * @param {*} a 起始坐标
 * @param {*} b 终点坐标
 */
const getRotation = function(a, b) {
  const x = Math.abs(a.x - b.x); const y = Math.abs(a.y - b.y)
  const l = Math.sqrt(x * x + y * y)
  if (b.x > a.x) {
    return 180 - Math.round(Math.asin(y / l) / Math.PI * 180)
  }
  return Math.round(Math.asin(y / l) / Math.PI * 180)
}

/**
 * 根据两点坐标算出随机的中间位置
 * @param {*} min
 * @param {*} max
 */
const getRandom = function(min, max) {
  return min + Math.random() * (max - min)
}

/**
 * 获取1到target中间的随机数
 * @param {*} target
 */
const getRandomNum = function(target) {
  return Math.floor(Math.random() * Math.floor(target)) + 1;
}
export default { getRotation, getRandom, getRandomNum }
