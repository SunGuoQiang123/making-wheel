/**
 * 将字符串转换为url_safe 的 base64 字符串
 * @param {String} str 待转换字符串
 */
export function url_safe_base64_encode(str) {
  if (typeof str !== 'string') {
    return;
  }
  const base64_encoded = window.btoa(str);
  return base64_encoded.replace(/[+,\/,=]/g, function(s) {
    const map = {
      '+': '-',
      '=': '',
      '/': '_'
    };
    return map[s];
  });
}

/**
 * 将编码后的base64字符串解码
 * @param {String} str 待解码字符串
 */
export function safe_decode(str) {
  if (typeof str !== 'string') {
    return;
  }
  while (str.length % 4 !== 0) {
    str += '=';
  }
  const base_encoded = str.replace(/[-,_]/g, function(s) {
    if (s === '-') {
      return '+';
    } else if(s === '_') {
      return '/';
    }
  });
  return window.atob(base_encoded);
}
