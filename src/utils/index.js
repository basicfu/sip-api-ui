import { getOrCreateStore } from 'utils/store';

export function getQueryString(name) {
  const reg = new RegExp(`(^|&)${  name  }=([^&]*)(&|$)`, "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  };
  return undefined;
}
export function getParentName(all, id, p) {
  let text = '';
  for (const e in all) {
    const item = all[e];
    if (item.id === id) {
      if (p !== undefined) {
        text = p.name;
      }
      break;
    } else if (item.children.length !== 0) {
      text = getParentName(item.children, id, item);
    }
  }
  return text;
}

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 * */
function dataType(obj) {
  if (obj === null) return 'Null';
  if (obj === undefined) return 'Undefined';
  return Object.prototype.toString.call(obj).slice(8, -1);
}

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 * 如果是array原样返回
 * @param obj
 */
export function dealObjectValue(obj) {
  if (obj instanceof Array) {
    return obj;
  }
  const param = {};
  if (obj === null || obj === undefined) return param;
  for (const key in obj) {
    if (dataType(obj[key]) === 'Object') {
      param[key] = dealObjectValue(obj[key]);
    } else if (obj[key] !== null && obj[key] !== undefined) {
      param[key] = obj[key];
    }
  }
  return param;
}

export function formatFlag(data) {
  if (data === undefined || data === null) {
    return '';
  }
  if (data === false || data === 0) {
    return '否';
  }
  return '是';
}

export function formatDict(value, dict) {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  const data = getOrCreateStore().getState().global.dict;
  const option = [...(data && data[dict] && data[dict].children) || []];
  const values = option.filter(it => it.value === value);
  if (values.length !== 0) {
    return values[0].name;
  }
  return '';
}
export function formatOptions(value, options) {
  const values = options.filter(it => it.value === value);
  if (values.length !== 0) {
    return values[0].name;
  }
  return '';
}
export function formatOtherDict(value, dict) {
  if (value === undefined || value === null || value === '') {
    return '';
  }
  const data = getOrCreateStore().getState().global.otherDict;
  const option = [...(data && data[dict] && data[dict].children) || []];
  const values = option.filter(it => it.value === value);
  if (values.length !== 0) {
    return values[0].name;
  }
  return '';
}

export function formatDateTime(data) {
  if (data === undefined || data === null) {
    return '';
  }
  const date = new Date(data * 1000);
  const format = 'yyyy-MM-dd hh:mm:ss';
  const paddNum = function (num) {
    num += '';
    return num.replace(/^(\d)$/, '0$1');
  };
  const cfg = {
    yyyy: date.getFullYear(), // 年 : 4位
    yy: date.getFullYear().toString().substring(2), // 年 : 2位
    M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
    MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
    d: date.getDate(), // 日 : 如果1位的时候不补0
    dd: paddNum(date.getDate()), // 日 : 如果1位的时候补0
    hh: paddNum(date.getHours()), // 时
    mm: paddNum(date.getMinutes()), // 分
    ss: paddNum(date.getSeconds()), // 秒
  };
  return format.replace(/([a-z])(\1)*/ig, (m) => {
    return cfg[m];
  });
}

export function formatDate(data) {
  if (data === undefined || data === null) {
    return '';
  }
  const date = new Date(data);
  const format = 'yyyy-MM-dd';
  const paddNum = function (num) {
    num += '';
    return num.replace(/^(\d)$/, '0$1');
  };
  const cfg = {
    yyyy: date.getFullYear(), // 年 : 4位
    yy: date.getFullYear().toString().substring(2), // 年 : 2位
    M: date.getMonth() + 1, // 月 : 如果1位的时候不补0
    MM: paddNum(date.getMonth() + 1), // 月 : 如果1位的时候补0
    d: date.getDate(), // 日 : 如果1位的时候不补0
    dd: paddNum(date.getDate()), // 日 : 如果1位的时候补0
    hh: paddNum(date.getHours()), // 时
    mm: paddNum(date.getMinutes()), // 分
    ss: paddNum(date.getSeconds()), // 秒
  };
  return format.replace(/([a-z])(\1)*/ig, (m) => {
    return cfg[m];
  });
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function getUrlParam(url) {
  const obj = {};
  (url || location.href).replace(/([^?&=]+)=([^?&=#]+)/g, function () {
    obj[arguments[1]] = arguments[2];
  });
  return obj;
}

function findActivePage(path, menus) {
  for (let i = 0; i < menus.length; i += 1) {
    const menu = menus[i];
    if (path === menu.path && (!menu.children || menu.children.length === 0)) {
      return menu;
    }
    if (menu.children && menu.children.length > 0) {
      const result = findActivePage(path, menu.children);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

export function getActivePage(path, menus) {
  if (!menus || menus.length === 0) {
    return {};
  }
  let r = findActivePage(path, menus);
  if (!r) {
    r = {};
  }
  return r;
}

export function getAllIdByTreeData(data) {
  let ids = [];
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids = ids.concat(getAllIdByTreeData(item.children));
    }
  }
  return ids;
}
export function getCountByTreeData(data) {
  let n = 0;
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    n += 1;
    if (item.children && item.children.length > 0) {
      n += getCountByTreeData(item.children);
    }
  }
  return n;
}

/**
 * 面包屑刷新判断每层是否应该是open
 */
export function breadcrumb(items, select) {
  const split=select.split('-');
  const type=split.length===2?split[0].toUpperCase():'';
  const key=split.length===2?split[1]:'';
  // console.log(select+"+"+key+"+"+type);
  const path = [];
  if (!items || items.length === 0) {
    return path;
  }
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    path.push(item.id);
    if (key === item.id.toString()&& type===item.type) {
      return path;
    }
    if (item.children && item.children.length > 0) {
      const result = breadcrumb(item.children, select);
      if (result.length !== 0) {
        path.push(...result);
        return path;
      }
    }
    path.pop();
  }
  return [];
}
