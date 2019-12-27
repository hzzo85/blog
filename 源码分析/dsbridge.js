var bridge = {
  default: this, // for typescript
  call: function(method, args, cb) {
    var ret = "";
    // 参数兼容处理
    if (typeof args == "function") {
      cb = args;
      args = {};
    }
    var arg = { data: args === undefined ? null : args };
    // 1、在window下挂载cb
    // 2、在arg中添加方法名，arg被格式化成
    //    {
    //      data: args,
    //      _dscbstub: cbname
    //    }
    // 3、转成字符串
    if (typeof cb == "function") {
      var cbName = "dscb" + window.dscb++;
      window[cbName] = cb;
      // 通过_dscbstub传递函数名称
      arg["_dscbstub"] = cbName;
    }
    arg = JSON.stringify(arg);

    //if in webview that dsBridge provided, call!
    if (window._dsbridge) {
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      // 对话框传递信息
      ret = prompt("_dsbridge=" + method, arg);
    }

    return JSON.parse(ret || "{}").data;
  },
  register: function(name, fun, asyn) {
    var q = asyn ? window._dsaf : window._dsf;
    if (!window._dsInit) {
      window._dsInit = true;
      //notify native that js apis register successfully on next event loop
      setTimeout(function() {
        bridge.call("_dsb.dsinit");
      }, 0);
    }
    if (typeof fun == "object") {
      q._obs[name] = fun;
    } else {
      q[name] = fun;
    }
  },
  registerAsyn: function(name, fun) {
    this.register(name, fun, true);
  },
  hasNativeMethod: function(name, type) {
    return this.call("_dsb.hasNativeMethod", {
      name: name,
      type: type || "all"
    });
  },
  // dialog弹出控制
  disableJavascriptDialogBlock: function(disable) {
    this.call("_dsb.disableJavascriptDialogBlock", {
      disable: disable !== false
    });
  }
};

!(function() {
  if (window._dsf) return;
  var ob = {
    _dsf: {
      _obs: {}
    },
    _dsaf: {
      _obs: {}
    },
    dscb: 0,
    dsBridge: bridge,
    // native code
    close: function() {
      bridge.call("_dsb.closePage");
    },
    _handleMessageFromNative: function(info) {
      var arg = JSON.parse(info.data);
      var ret = {
        id: info.callbackId,
        complete: true
      };
      var f = this._dsf[info.method];
      var af = this._dsaf[info.method];
      var callSyn = function(f, ob) {
        ret.data = f.apply(ob, arg);
        bridge.call("_dsb.returnValue", ret);
      };
      var callAsyn = function(f, ob) {
        arg.push(function(data, complete) {
          ret.data = data;
          ret.complete = complete !== false;
          bridge.call("_dsb.returnValue", ret);
        });
        f.apply(ob, arg);
      };
      if (f) {
        callSyn(f, this._dsf);
      } else if (af) {
        callAsyn(af, this._dsaf);
      } else {
        //with namespace
        var name = info.method.split(".");
        if (name.length < 2) return;
        var method = name.pop();
        var namespace = name.join(".");
        var obs = this._dsf._obs;
        var ob = obs[namespace] || {};
        var m = ob[method];
        if (m && typeof m == "function") {
          callSyn(m, ob);
          return;
        }
        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];
        if (m && typeof m == "function") {
          callAsyn(m, ob);
          return;
        }
      }
    }
  };
  for (var attr in ob) {
    // 在window下注入属性
    window[attr] = ob[attr];
  }
  bridge.register("_hasJavascriptMethod", function(method, tag) {
    var name = method.split(".");
    if (name.length < 2) {
      return !!(_dsf[name] || _dsaf[name]);
    } else {
      // with namespace
      var method = name.pop();
      var namespace = name.join(".");
      var ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
      return ob && !!ob[method];
    }
  });
})();

module.exports = bridge;
