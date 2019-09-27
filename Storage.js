function isBaseType(val) {
  return (typeof val !== 'object' && typeof val !== 'function') || val == null;
}

export const LocStorage = (function() {
  let _instance;

  function Storage() {
    if (!this instanceof Storage) {
      return new Storage();
    }
    if (!_instance) {
      _instance = new Storage();
    }
    return _instance;
  }

  Storage.prototype.get = function(key) {
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

  Storage.prototype.set = function(key, value, seconds) {
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

  Storage.prototype.clear = function() {
    return LocStorage.clear();
  };

  Storage.prototype.remove = function(key) {
    return localStorage.removeItem(key);
  };

  Storage.prototype.length = localStorage.length;

  return Storage;
})();
