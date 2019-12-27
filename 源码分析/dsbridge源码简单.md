# dsbridge 简析

一下内容会以以 javascript 代码 和 java 为例，简析 dsbridege

### call

```js
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
      // 在客户端通过一下方法注入window
      // super.addJavascriptInterface(innerJavascriptInterface, BRIDGE_NAME);
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      // 低版本浏览器对话框传递信息
      // settings.setUserAgentString(settings.getUserAgentString() + " _dsbridge");
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
```

```java
  // 这边过来的是 prompt("_dsbridge=" + method, {
  //  data: args,
  //  _dscbstub: cbname
  // });
  public String call(String methodName, String argStr) {
    String error = "Js bridge  called, but can't find a corresponded " +
      "JavascriptInterface object , please check your code!";
    // 按'.'被格式化成数组 String[]{namespace, method};
    String[] nameStr = parseNamespace(methodName.trim());
    methodName = nameStr[1];
    // javaScriptNamespaceInterfaces这里是一个 hashMap
    Object jsb = javaScriptNamespaceInterfaces.get(nameStr[0]);
    // 这是调用原生方法的结果，最终会以字符串返回
    JSONObject ret = new JSONObject();
    ...
    try {
      JSONObject args = new JSONObject(argStr);
      if (args.has("_dscbstub")) {
        callback = args.getString("_dscbstub");
      }
      // 获取参数
      if(args.has("data")) {
        arg = args.get("data");
      }
    } catch (JSONException e) {
      ...
    }

    ...
    // 定义返回结果
    JSONObject ret = new JSONObject();
    // 会按是否异步做不同的操作
    if (asyn) {
      method.invoke(jsb, arg, new CompletionHandler() {
        ...
        private void complete(Object retValue, boolean complete) {
          try {
            JSONObject ret = new JSONObject();
            ret.put("code", 0);
            ret.put("data", retValue);
            if (cb != null) {
              String script = String.format("%s(%s.data);", cb, ret.toString());
              if (complete) {
                // 如果完成则删除 window[cbName];
                script += "delete window." + cb;
              }
              // 这段是关键等下做解析
              evaluateJavascript(script);
            }
          } catch (Exception e) {
              e.printStackTrace();
          }
        }
      }
    } else {
      // 这边是同步操作，
      retData = method.invoke(jsb, arg);
      ret.put("code", 0);
      ret.put("data", retData);
    }
  }
```

###

```java
private void _evaluateJavascript(String script) {
  if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    DWebView.super.evaluateJavascript(script, null);
  } else {
    // 通过url执行回调
    super.loadUrl("javascript:" + script);
  }
}
```

#### 参考资料

[H5页面与原生交互的方法之 一、addJavascriptInterface](https://www.jianshu.com/p/07f2e1364f35)
[最好用的跨平台Js bridge新秀-DSBridge 安卓篇](https://www.jianshu.com/p/f9c51b4a8135)