/**
 * 根据目标位置 获取旋转角度
 * @param {*} a 起始坐标
 * @param {*} b 终点坐标
 */
let getRotation = function(a, b) {
  let x = Math.abs(a.x - b.x), y = Math.abs(a.y - b.y);
  let l = Math.sqrt(x * x + y * y);
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
let getRandom = function(min, max){
  return min + Math.random() * (max - min)
}

/**
 * 获取两数之间的随机整数
 * @param {*} min 
 * @param {*} max 
 */
let getRandomNum = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}
export default {getRotation, getRandom, getRandomNum}