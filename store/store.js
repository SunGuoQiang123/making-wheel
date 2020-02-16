class Store {
  constructor(options) {

    if(!Vue && winow && window.Vue) {
      install(Vue);
    }
    const { strict, state, mutations, actions, getters } = options;
    this.strict = strict;
    this._commiting = false;
    this.getters = {};
    this._mutations = Object.create(null);
    this._getters = Object.create(null);
    this._actions = Object.create(null);
    this.registerMutations(mutations);
    this.registerActions(actions);
    this.registerGetters(getters);
    this.initStoreState(state);
  }
  get state() {
    return this._vm._data.$_state;
  }
  set state(val) {
    console.error('state should be change by replaceState');
  }
  initStoreState(state) {
    const computed = {};
    for(const [key, value] of this._getters) {
      computed[key] = value;
      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
        enumerable: true
      });
    }
    this._vm = new Vue(
      {
        data: {
          $_state:state
        },
        computed
      }
    );

    if (this.strict) {
      this.enableStrictMode();
    }
  }

  enableStrictMode() {
    this._vm.$watch(() => { return this._vm._data.$_state; }, () => {
      if (!this._commiting) {
        console.error('state must change by mutation');
      }
    }, {deep: true});
  }
  registerActions(actions) {
    for(const [key, value] of Object.entries(actions)) {
      if (key in this._actions) {
        this._actions[key].push(function wrappedAction(payload) {
          const res = value({
            state: this.state,
            commit: this.commit,
            dispatch: this.dispatch
          }, payload);
          if (typeof res.then !== 'function') {
            res = Promise.resolve(res);
          }
          return res;
        });
      } else {
        this._actions[key] = [value];
      }
    }
  }
  registerMutations(mutations) {
    for(const [key, value] of Object.entries(mutations)) {
      if (key in this._mutations) {
        this._mutations[key].push(value);
      } else {
        this._mutations[key] = [value];
      }
    }
  }

  _withCommit(fn) {
    const commiting = this._commiting;
    this.commiting = true;
    fn();
    this._commiting = commiting;
  }

  commit(type, payload) {
    const cbs = this._mutations[type];
    if (!cbs) {
      throw('unknown mutation types!');
    }
    if (Array.isArray(cbs)) {
      for(let i = 0; i < cbs.length; i++) {
        this._withCommit(cbs[i].bind(null, this.state, payload));
      }
    }
  }

  registerGetters(getters) {
    for(const [key, value] of Object.entries(getters)) {
      if (key in this._getters) {
        throw('getters duplicate!');
      } else {
        this._getters[key] = function() {
          return value(this.state, this.getters);
        };
      }
    }
  }

  dispatch(type, payload) {
    const cbs = this._actions[type];
    if (!cbs) {
      throw('unknown action types!');
    }
    if (Array.isArray(cbs)) {
      const result = Promise.all(cbs.map(handler => {
        return handler(payload);
      }));

      return result;
    }
  }
}
let Vue;
function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate: applyMixin
  });
}

function applyMixin() {
  console.log('enter beforeCreate hook for every Vue instance');

  if (this.$options && this.$options.store) {
    this.$store = this.$options.store;
  } else if (this.$parent && this.$parent.$store) {
    this.$store = this.$parent.$store;
  }
}

export default { install, Store };
