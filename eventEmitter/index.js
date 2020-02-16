'use strict';

class Listener {
  constructor(fn, context, once) {
    if(typeof fn !== 'function') {
      throw new Error('fn must be a function!');
    }
    this.fn = fn;
    this.context = context;
    this.once = once;
  }
}

class EventEmitter {
  constructor() {
    this._subs = Object.create(null);
    this._eventNum = 0;
  }
  _addListener(name, listener) {
    if(this._subs[name]) {
      if(this._subs[name] instanceof Listener) {
        this._subs[name] = [this._subs[name], listener];
      } else {
        this._subs[name].push(listener);
      }
    } else {
      this._subs[name] = listener;
      this._eventNum++;
    }
  }
  on(name, cb, ctx) {
    const listener = new Listener(cb, ctx || this, false);
    this._addListener(name, listener);
    return this;
  }
  emit(name, ...args) {
    const listeners = this._subs[name];
    if(listeners) {
      if(listeners instanceof Listener) {
        this._callFn(name, listeners, args);
      } else {
        for (let i = 0, len = listeners.length; i < len; i++) {
          this._callFn(name, listeners[i], args);
        }
      }
      return true;
    }
    return false;
  }
  _callFn(name, listener, args) {
    const ctx = listener.context;
    listener.fn.apply(ctx, args);
    if(listener.once) {
      this.off(name, listener.fn, listener.context, listener.once);
    }
  }
  once(name, fn, ctx) {
    const listener = new Listener(fn, ctx || this, true);
    this._addListener(name, listener);
    return this;
  }

  off(name, fn, ctx, once) {
    // 移除全部事件及监听器
    if(!name) {
      this._subs = Object.create(null);
      this._eventNum = 0;
    } else if(!fn) {
      // 移除当前事件下 全部监听器
      delete this._subs[name];
      this._eventNum--;
    } else {
      // 移除特定监听器
      const listeners = this._subs[name];
      if (listeners instanceof Listener) {
        if(
          listerns.fn === fn &&
          (!ctx || listeners.context === ctx) &&
          (!once || listeners.once === once)
          ) {
            delete this._subs[name];
            this._eventNum--;
          }
        } else if (Array.isArray(listeners)) {
          let arr = [];
          for(let i = 0, len = listeners.length; i < len; i++) {
            if(!(
              listeners[i].fn === fn &&
              (!ctx || listeners[i].context === ctx) &&
              (!once || listeners[i].once === once))
            ) {
              arr.push(listeners[i]);
            }
          }
          this._subs[name] = arr;
        }
    }
    return this;
  }
  listenerCount(name) {
    const listeners = this._subs[name];
    if (!listeners) return 0;
    if(listeners instanceof Listener) return 1;
    return listeners.length;
  }
  listeners(name) {
    const listeners = this._subs[name];
    if(!listeners) return [];
    if(listeners instanceof Listener) return [listeners.fn];
    const cbs = [];
    for(let i = 0, len = listeners.length; i < len; i++) {
      cbs.push(listeners[i].fn);
    }
    return cbs;
  }
  eventNames() {
    if(this._eventNum === 0) return [];
    const res = [];
    res = res.concat(Object.getOwnPropertyNames(this._subs));
    res = res.concat(Object.getOwnPropertySymbols(this._subs));
    return res;
  }
}

module.exports = EventEmitter;
