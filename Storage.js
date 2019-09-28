function isBaseType(val) {
  return (typeof val !== 'object' && typeof val !== 'function') || val == null;
}

class LocStorage {
  constructor() {
  }
  static getInstancce() {
    if (!LocStorage.instance) {
      LocStorage.instance = new LocStorage();
    }
    return LocStorage.instance;
  }

  get(key) {
    const data = localStorage.getItem(key);
    if (!data) {
      return data;
    }

    try {
      const parsedData = JSON.parse(data);
      if (
        !parsedData.timestamp ||
        parsedData.timestamp > new Date().getTime()
      ) {
        const realStr = parsedData.data.slice(0, -1);
        const type = parsedData.data.slice(-1);
        return type === '0' ?
                realStr :
                (type === '1' ? JSON.parse(realStr) : null);
      } else {
        this.remove(key);
      }
    } catch (error) {
      return null;
    }
  };

  set(key, value, seconds) {
    const data = isBaseType(value) ?
    value + '0' :
    JSON.stringify(value) + '1';

    let realValue;
    if (seconds > 0) {
      const timeToOverdue = new Date().getTime() + seconds * 1000;
      realValue = JSON.stringify({data, timestamp: timeToOverdue});
    } else {
      realValue = JSON.stringify({data});
    }

    localStorage.setItem(key, realValue);
  };

  clear() {
    return localStorage.clear();
  };

  remove(key) {
    return localStorage.removeItem(key);
  };

  get length() {
    return localStorage.length;
  }
}
