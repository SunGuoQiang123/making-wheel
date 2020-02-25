function Debug(name) {
  that = function log(...args) {
    if (log.enabled && process.env.DEBUG === log.pre) {
      function generateTime(time) {
        return `+${time} ms`;
      }
      const params = [log.pre].concat(args);
      if (log.lastTime >= 0) {
        const spent = new Date().getTime() - log.lastTime;
        params.push(generateTime(spent));
      } else {
        log.lastTime = new Date().getTime();
        params.push(generateTime(0));
      }
      log.log(...params);
    }
  };
  that.lastTime = -1;
  that.pre = name;
  that.enabled = true;
  that.log = Debug.log;
  Object.setPrototypeOf(that, Debug.prototype);
  Debug.instances.push(that);
  return that;
}

Debug.instances = [];
Debug.log = default_log;
Debug.disable = function () {
  Debug.instances.forEach(ins => {
    ins.enabled = false;
  });
}

Debug.prototype.extend = function (val) {
  const oldPre = this.pre;
  return new Debug(`${oldPre}:${val}`);
}

function default_log(...args) {
  console.error(...args);
}

module.exports = Debug;
