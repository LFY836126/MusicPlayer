/**
 * container define className ?
 * @param el
 * @param className
 * @returns {boolean}
 */
// 判断当前元素是否有这个类，利用正则表达式
export function hasClass(el, className) {
  // 如果是以类名开头或者空白符后面跟着这个类名，类名后面是空白字符或者结束，，那么就代表有这个类名
  const reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  // 通过正则检测是否含有这样格式的类名，有就返回true，没有就返回false
  return reg.test(el.className)
}

// 给dom添加类名
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  // 先通过' '分割成一个数组
  const newClass = el.className.split(' ')
  // 把新的className添加进去
  newClass.push(className)
  // 然后通过join，空格连起来
  el.className = newClass.join(' ')
}

// get & set val
export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val)
  }
  return el.getAttribute(name)
}

// 添加浏览器前缀
// Configuration of different browser CSS
const elementStyle = document.createElement('div').style
const vendor = (() => {
  const transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (const key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  // backdrop-filter -> webkitBackdrop-filter
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}
