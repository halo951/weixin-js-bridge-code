!(function(e) {
  function t(o) {
    if (n[o]) return n[o].exports;
    var r = (n[o] = {
      i: o,
      l: false,
      exports: {}
    });
    return e[o].call(r.exports, r, r.exports, t), (r.l = true), r.exports;
  }
  var n = {};
  t.m = e;
  t.c = n;
  t.d = function(e, n, o) {
    if (!t.o(e, n)) {
      Object.defineProperty(e, n, {
        enumerable: true,
        get: o
      });
    }
  };
  t.r = function(e) {
    "undefined" != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }),
      Object.defineProperty(e, "__esModule", {
        value: true
      });
  };
  t.t = function(e, n) {
    if ((1 & n && (e = t(e)), 8 & n)) return e;
    if (4 & n && "object" == typeof e && e && e.__esModule) return e;
    var o = Object.create(null);
    if (
      (t.r(o),
      Object.defineProperty(o, "default", {
        enumerable: true,
        value: e
      }),
      2 & n && "string" != typeof e)
    )
      for (var r in e)
        t.d(
          o,
          r,
          function(t) {
            return e[t];
          }.bind(null, r)
        );
    return o;
  };
  t.n = function(e) {
    var n =
      e && e.__esModule
        ? function() {
            return e.default;
          }
        : function() {
            return e;
          };
    return t.d(n, "a", n), n;
  };
  t.o = function(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  };
  t.p = "";
  t((t.s = 233));
})({
  20: function(e) {
    // 这个方法应该是打开跟微信 通信的 socket 用的
    function t(e) {
      a && a.readyState === o.OPEN ? a.send(JSON.stringify(e)) : d.push(e);
    }
    var n = window.navigator || window.__global.navigator; // 浏览器标识
    var socket1 = window.WebSocket || window.__global.WebSocket; // web socket
    var r = window.prompt || window.__global.prompt; //方法用于显示可提示用户进行输入的对话框。 这个方法返回用户输入的字符串。
    var i = n.userAgent.match(/port\/(\d*)/); //
    var a = null;
    var c = `ws: //127.0.0.1:9974`;
    var l = null;
    var s = [];
    var d = [];
    const u = "GET_MESSAGE_TOKEN";
    e.exports = {
      connect: function e(n) {
        l = n || l;
        var i = r(u);
        a = new socket1(`ws: //127.0.0.1:9974`, `${window.navigator}#${9974}#`);
        a.onopen = function() {
          let e = [...d]; // merge array
          d = []; // clear
          e.forEach(e => {
            t(e);
          });
        };
        a.onclose = function() {
          a = null;
          setTimeout(() => {
            e(n);
          }, 100);
        };
        a.onmessage = function(e) {
          try {
            !(function(e) {
              s.forEach(t => {
                try {
                  t.call(this, e);
                } catch (e) {
                  console.error(e);
                }
              });
            })(JSON.parse(e.data));
          } catch (e) {}
        };
      },
      send: t,
      registerCallback: e => {
        s.push(e);
      },
      getWs: () => a
    };
  },
  233: function(e, t, n) {
    // 这个方法 使用来 获取 userAgent 标识, 以及判断不同环境下,要封禁的 window 的一些属性用的, 注意,小程序有单独的处理逻辑的
    const o = navigator.userAgent;
    const r = 0 < o.indexOf(" webdebugger "); // 存在 debug?
    const i = 0 < o.indexOf(" miniprogramhtmlwebview "); // 存在 小程序<web-view>
    const a = 0 < o.indexOf(" miniprogram "); // 存在 小程序
    const c = 0 < o.indexOf(" gameservice "); // 存在 小游戏
    const l = 0 < o.indexOf(" appservice "); // 存在 app 服务
    const s = 0 < o.indexOf(" wechatideplugin "); // 存在 微信IDE插件
    const d = n(234); // 禁用界面间通信,除了位置选择器(可能这个特殊点吧)
    const u = (n(235), n(236)); //这个操作类似于重写window 对象吧,要封禁一些对象,保留微信允许的对象操作, 然后返回重写的结果.
    const w = n(238); // 阻断 浏览器的 拖拽和 拖放操作
    const f = n(239); // 阻断按住 ctrl 键 缩放字体操作
    const p = n(240); // 阻断 右键点击事件
    // 调用
    d();
    f();
    w();
    if (i) {
      // 重写小程序微信环境标识,看起来是后续补的逻辑
      window.__wxjs_environment = "miniprogram";
    }
    if (r) {
      // 这里应该是判断是否是在小程序的web视图内,在的话,走一个单独处理
      n(241)();
    }
    if (c || l) {
      // 小游戏和 app 要 封window 的一些对象.
      u();
    }
    if (s) {
      // 微信IDE插件
      n(247);
    }
    if (c || a || i) {
      // 如果 是小游戏 ,小程序, 小程序的 web-view
      p(); // 阻断 右键点击事件
    }
  },
  234: function(e) {
    // 监听 window消息推送,但是对于位置选择器会有一个特殊的处理逻辑,但是其他情况下不允许界面通信
    e.exports = () => {
      window.addEventListener("message", e => {
        let t = e.data;
        if (t && "object" == typeof t) {
          (e => {
            if (e && ("geolocation" === e.module || "locationPicker" === e.module)) {
              let t = e;
              if ("geolocation" == e.module) {
                // 应该是创建一个位置选择器对象
                t = {
                  module: "locationPicker", // 位置选择器
                  latlng: { lat: e.lat, lng: e.lng }, // i don't know ,but this could be coordinates
                  poiaddress: `${e.province}${e.city}`, // 地址
                  poiname: e.addr, // 景点 ? 周边明确建筑物?
                  cityname: e.city // 城市
                };
              }
              // don't know they want.
              window.__global.alert(`map handle:${JSON.stringify(t)}`);
            }
          })(t);
        }
      });
    };
  },
  235: function() {
    // 用来覆盖window对象,就api中微信允许使用的对象,这里是直接给window对象改了
    // 判断当前浏览协议不是chrome 扩展
    if (!location.protocol.startsWith("chrome-extension")) {
      const i = window.alert;
      const a = window.prompt;
      // 此处应该是覆盖下window的一些对象,比如 alert,然后用 微信自己的去替换. 意思是微信阉割了一部分chrome的操作,只保留了一些微信允许的.
      window.__global = {
        dialogDisable: false,
        parent: window.parent,
        Worker: Worker,
        WebSocket: WebSocket,
        XMLHttpRequest: XMLHttpRequest,
        FileReader: FileReader,
        atob: window.atob.bind(window), // 解码  base-64
        btoa: window.btoa.bind(window), // 编码  base-64
        requestAnimationFrame: window.requestAnimationFrame, // 执行帧动画
        cancelAnimationFrame: window.cancelAnimationFrame, // 取消帧动画
        setTimeout: setTimeout, //
        clearTimeout: clearTimeout,
        setInterval: setInterval,
        clearInterval: clearInterval,
        Image: Image,
        Audio: Audio,
        navigator: navigator,
        addEventListener: window.addEventListener.bind(window),
        removeEventListener: window.removeEventListener.bind(window),
        canvasProto: {},
        canvasWebGlContextProto: {},
        canvas2dContextProto: {},
        history: window.history
      };
      window.__global.alert = function() {
        if (!window.__global.dialogDisable) return i.apply(window, arguments);
      };
      window.__global.prompt = function() {
        if (!window.__global.dialogDisable) return a.apply(window, arguments);
      };
      window.onerror = function(e, t, n, o, r) {
        try {
          return window.__global.WeixinJSBridge.__triggerOnEvent("onError", r), true;
        } catch (e) {}
      };
      var e = document.createElement("canvas");
      var t = document.createElement("canvas");
      var n = e.getContext("2d");
      var o = t.getContext("webgl");
      const c = (e, t) => {
        for (let n in (Object.setPrototypeOf(e, t), t)) {
          try {
            e[n] = t[n];
          } catch (e) {}
        }
      };
      try {
        c(window.__global.canvasProto, Object.getPrototypeOf(e));
      } catch (e) {}
      try {
        c(window.__global.canvasWebGlContextProto, Object.getPrototypeOf(o));
      } catch (e) {}
      try {
        c(window.__global.canvas2dContextProto, Object.getPrototypeOf(n));
      } catch (e) {}
      for (var r in ((window.__global.document = {}), window.document))
        try {
          window.__global.document[r] = "function" == typeof window.document[r] ? window.document[r].bind(document) : window.document[r];
        } catch (e) {}
      const l = console.error.bind(console);
      const s = console.warn.bind(console);
      console.error = function(...e) {
        try {
          if (1 >= e.length) return l(...e);
          for (const t of e) if ("object" == typeof t) return l(...e);
          return l(e.join(" "));
        } catch (t) {
          l(...e);
        }
      };
      console.warn = function(...e) {
        try {
          if (1 >= e.length) return s(...e);
          for (const t of e) if ("object" == typeof t) return s(...e);
          return s(e.join(" "));
        } catch (t) {
          s(...e);
        }
      };
    }
  },
  236: function(e, t, n) {
    // 这个方法 是用来过滤window对象允许操作的规则的.
    const { windowRemain: o, windowCanNotEnumerable: r, documentRemain: i, nodeGlobal: a } = n(237);
    e.exports = () => {
      const e = Object.getOwnPropertyNames(window).filter(e => 0 > a.indexOf(e));
      for (const t of e) {
        if (o[t]) continue;
        const e = Object.getOwnPropertyDescriptor(window, t);
        (e && true !== e.configurable) || delete window[t];
      }
      for (const e in document) {
        if (i[e]) continue;
        const t = Object.getOwnPropertyDescriptor(document, e);
        (t && true !== t.configurable) || (delete document[e], Object.defineProperty(document, e, { configurable: true, value: void 0 }));
      }
      var t = { readyState: true, onreadystatechange: true, createElement: true, getElementById: true, addEventListener: true, getElementsByTagName: true };
      for (const e in window.__global.document) {
        if (t[e]) continue;
        const n = Object.getOwnPropertyDescriptor(window.__global.document, e);
        (n && true !== n.configurable) || (delete window.__global.document[e], Object.defineProperty(window.__global.document, e, { configurable: true, value: void 0 }));
      }
    };
  },
  237: function(e) {
    // 这个方法是用来定义window 规则的.
    e.exports = {
      // 覆盖下
      windowRemain: {
        parent: true,
        __global: true,
        atob: true,
        onload: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        requestAnimationFrame: true,
        cancelAnimationFrame: true,
        WebGLRenderingContext: true,
        innerWidth: true,
        innerHeight: true,
        process: true,
        require: true,
        navigator: true,
        self: true,
        performance: true,
        webkitURL: true
      },
      windowCanNotEnumerable: ["XMLHttpRequest", "WebSocket", "Audio", "DOMParser", "AudioContext", "WebGLRenderingContext", "WebAssembly"],
      documentRemain: { body: true, createElement: true, createDocumentFragment: true, head: true },
      nodeGlobal: [
        "Object",
        "Function",
        "Array",
        "Number",
        "parseFloat",
        "parseInt",
        "Boolean",
        "String",
        "Symbol",
        "Date",
        "Promise",
        "RegExp",
        "Error",
        "EvalError",
        "RangeError",
        "ReferenceError",
        "SyntaxError",
        "TypeError",
        "URIError",
        "JSON",
        "Math",
        "Intl",
        "ArrayBuffer",
        "Uint8Array",
        "Int8Array",
        "Uint16Array",
        "Int16Array",
        "Uint32Array",
        "Int32Array",
        "Float32Array",
        "Float64Array",
        "Uint8ClampedArray",
        "DataView",
        "Map",
        "Set",
        "WeakMap",
        "WeakSet",
        "Proxy",
        "Reflect",
        "Infinity",
        "NaN",
        "undefined",
        "decodeURI",
        "decodeURIComponent",
        "encodeURI",
        "encodeURIComponent",
        "escape",
        "unescape",
        "eval",
        "isFinite",
        "isNaN",
        "WebAssembly",
        "console",
        "DTRACE_NET_SERVER_CONNECTION",
        "DTRACE_NET_STREAM_END",
        "DTRACE_HTTP_SERVER_REQUEST",
        "DTRACE_HTTP_SERVER_RESPONSE",
        "DTRACE_HTTP_CLIENT_REQUEST",
        "DTRACE_HTTP_CLIENT_RESPONSE",
        "global",
        "process",
        "GLOBAL",
        "root",
        "Buffer",
        "clearImmediate",
        "clearInterval",
        "clearTimeout",
        "setImmediate",
        "setInterval",
        "setTimeout"
      ]
    };
  },
  238: function(e) {
    // 阻断拖拽,拖放事件
    function t(e) {
      // 阻断事件传播
      e.preventDefault(), e.stopPropagation();
    }
    function n(e) {
      // 阻断事件传播
      e.preventDefault(), e.stopPropagation();
    }
    let o = false;
    const r = () => {
      if (!o) {
        var e = document.body;
        if (e) {
          // 阻断window 原生的 拖拽事件
          e.addEventListener("dragover", t, false);
          // 阻断window 原生的 拖放事件
          e.addEventListener("drop", n, false);
        }
        o = true;
      }
    };
    e.exports = () => {
      // 在 document 准备完成后,执行 绑定阻断拖拽操作方法 ( 也就是说, 如果 把这玩意给 替换了的话,就不会出现 左滑退出这样的情况了? 但是好像微信自己的拖拽方法可能拦不住)
      if ("complete" == document.readyState || "interactive" == document.readyState) {
        r();
      } else {
        document.onreadystatechange = function() {
          if ("interactive" == document.readyState || "complete" == document.readyState) {
            r();
          }
        };
      }
    };
  },
  239: function(e) {
    //阻断 ctrl 键 + 鼠标滚轮缩放网页用的
    e.exports = () => {
      document.addEventListener("mousewheel", e => {
        e.ctrlKey && e.preventDefault();
      });
    };
  },
  240: function(e) {
    // 阻断网页右键菜单
    e.exports = () => {
      window.addEventListener(
        "contextmenu",
        e => {
          e.preventDefault();
        },
        true
      );
    };
  },
  241: function(e, t, n) {
    function o() {
      (function() {
        // 这里的操作应该是 清理 window 的触摸事件
        const e = ["ontouchstart", "ontouchend", "ontouchmove", "ontouchcancel"];
        for (var t = [window.__proto__, document.__proto__], n = 0; n < e.length; ++n) {
          for (var o = 0; o < t.length; ++o) {
            if (!(e[n] in t[o])) {
              Object.defineProperty(t[o], e[n], { value: null, writable: true, configurable: true, enumerable: true });
            }
          }
        }
      })();
      // 将微信js库放出去,外面访问到的就是这个处理过的对象,
      window.WeixinJSBridge = r;
      // 这里是创建一个 jsBridge ready 事件,用来通知 js-sdk 获取准备状态用的
      let e = document.createEvent("UIEvent");
      e.initEvent("WeixinJSBridgeReady", false, false);
      document.dispatchEvent(e);
    }
    // 调用 242 的方法,来创建 jsBridge
    const r = n(242);
    e.exports = function() {
      // 在window 加载完成时,清理完事件后,然后
      if ("complete" == document.readyState) {
        o();
      } else {
        window.addEventListener("load", () => {
          o();
        });
      }
    };
  },
  242: function(e, t, n) {
    const o = n(243);
    const r = n(246);
    var i = {
      call: function() {
        console.error("WeixinJSBridge.call 不被支持，请参考 http://mp.weixin.qq.com/wiki/7/aaa137b55fb2e0456bf8dd9148dd613f.html 进行正确调用");
      },
      log: function(e) {
        console.log(e);
      }
    };
    // 不明白为啥要分开写..
    i.invoke = o;
    i.on = r;
    e.exports = i;
  },
  243: function(e, t, n) {
    const o = n(65);
    const r = n(244);
    let i = {};
    let a = 1;
    o.registerCallback(e => {
      let { command: t, data: n } = e;
      if ("WEBDEBUGGER_INVOKE_CALLBACK" === t) {
        let e = n.callbackID;
        let t = i[e];
        if (t && "function" == typeof t.cb) {
          let e = t.api;
          let o = n.res;
          let i = n.ext;
          // 打印下要验证的接口
          console.group(`${new Date()} wx.${r.getSdkDisplayName(e)} end`);
          console.info(r.getSdkArgs(e, o));
          console.groupEnd();
          // - 验证配置是否加载完成
          if ("preVerifyJSAPI" === e && /^config:ok/.test(o.errMsg)) {
            // 验证js api列表
            let e = i.args.verifyJsApiList || [];
            let t = i.sdkResExt;
            let n = [];
            let o = [];
            e.forEach(e => {
              if (t.defaultPurview[e] || t.purviewFormGetA8key[e] || t.purviewFromPreVerify[e]) {
                if (0 === o.length) {
                  n.push(o);
                } else if (6 === o.length) {
                  o = [];
                  n.push(o);
                }
                o.push(r.getSdkDisplayName(e));
              }
            });
            console.group(`${new Date()} 当前页面通过 wx.config 获取到的 JSSDK 权限如下`);
            console.table(n);
            console.groupEnd();
          }
          t.cb(o);
        }
        delete i[e];
      } else {
        if ("WEBDEBUGGER_GET_TITLE" == t && self === top) {
          // web debug 获取标题?
          o.send({ command: "WEBDEBUGGER_GET_TITLE_RES", data: { title: document.title } });
        }
      }
    });
    e.exports = function(e, t, n) {
      if (!/^__sys/.test(e)) {
        console.group(`${new Date()} wx.${r.getSdkDisplayName(e)} begin`);
        console.info(r.getSdkArgs(e, t));
        console.groupEnd();
        let c = a++;
        i[c] = { api: e, cb: n };
        // dubg 情况下,发送 接口调用消息
        o.send({ command: "WEBDEBUGGER_INVOKE", data: { api: e, args: t, callbackID: c } });
      }
    };
  },
  244: function(e, t, n) {
    // 对外公布的api列表应该是这样的
    function o(e) {
      return r.sdkDisplayName[e] || e;
    }
    var r = n(245);
    e.exports = {
      // 获取 sdk 接口列表?
      getSdkArgs: function(e, t = {}) {
        let n = JSON.parse(JSON.stringify(t));
        if ((delete n.verifyAppId, "preVerifyJSAPI" === e)) {
          n.jsApiList = n.verifyJsApiList || [];
          n.jsApiList.forEach((e, t) => {
            n.jsApiList[t] = o(e);
          });
          delete n.verifyJsApiList;
          if (n.verifyNonceStr) {
            n.nonceStr = n.verifyNonceStr;
          }
          delete n.verifyNonceStr;
          if (n.verifySignature) {
            n.signature = n.verifySignature;
          }
          delete n.verifySignature;
          if (n.verifyTimestamp) {
            n.timestamp = n.verifyTimestamp;
          }
          delete n.verifyTimestamp;
          delete n.verifySignType;
        } else {
          for (let e in t) {
            r.doNotDisplayArgsConfig[e];
            delete n[e];
          }
        }
        return n;
      },
      getSdkDisplayName: o
    };
  },
  245: function(e) {
    e.exports = {
      // 开放api列表
      sdkDisplayName: {
        shareTimeline: "onMenuShareTimeline",
        sendAppMessage: "onMenuShareAppMessage",
        shareQQ: "onMenuShareQQ",
        shareWeiboApp: "onMenuShareWeibo",
        shareQZone: "onMenuShareQZone", // 以上部分可能是调用 分享的 方法, 貌似可以动过 JsBrige 直接调用? 还没测试柜规则是否允许
        "menu:share:timeline": "onMenuShareTimeline", // 分享到朋友圈回调
        "menu:share:appmessage": "onMenuShareAppMessage", // 分享到好友回调
        "menu:share:qq": "onMenuShareQQ", // 分享到qq回调
        "menu:share:weiboApp": "onMenuShareWeibo", // 分享到 微博回调
        "menu:share:QZone": "onMenuShareQZone", // 分享到 qq空间回调
        preVerifyJSAPI: "config", // 预先验证配置?
        imagePreview: "previewImage", // 预览图片
        geoLocation: "getLocation", // 获取 地址
        openProductViewWithPid: "openProductSpecificView", // 跳转微信商品页
        batchAddCard: "addCard", // 添加卡券到微信卡包
        batchViewCard: "openCard", // 打开卡券
        getBrandWCPayRequest: "chooseWXPay", // 调用微信支付
        showPickerView: "showPickerView", // 大概选择视图? android 和ios 应该不一样吧,但是应该调用的是微信的.
        showDatePickerView: "showDatePickerView" // 打开时间选择视图
      },
      // 不能显示的api配置?
      doNotDisplayArgsConfig: {
        appId: true, // app id
        verifyAppId: true, // 验证过的 appid,以下几项是验证过的微信参数
        verifyNonceStr: true,
        verifySignType: true,
        verifySignature: true,
        verifyTimestamp: true,
        webviewId: true, // web视图id,应该是微信用来区分具体使用环境的
        origin: true, // 以下几项暂时不知道具体方面
        __isFromOn__: true,
        __domain__: true,
        __url__: true
      }
    };
  },
  246: function(e, t, n) {
    var o = {};
    // 应该是debug方法的注册完成回调, 猜测 65是 dubug的逻辑
    n(65).registerCallback(e => {
      let { command: t, data: n } = e;
      if ("WEBDEBUGGER_ON_EVENT" === t) {
        let e = o[n.eventName];
        if ("function" == typeof e) {
          e(n.data);
        }
      }
    });
    e.exports = function(e, t) {
      o[e] = t;
    };
  },
  247: function(e, t, n) {
    // 这里看起来是处理插件相关的逻辑
    const o = window.navigator.userAgent.match(/pluginid\/(\S*)/);
    const r = o ? o[1] : "";
    const i = n(248);
    const a = n(249);
    // 应该是插件环境下,要绑定的相关事件  r是 插件环境的判断条件?
    if (r) {
      // 给 ide 和 插件仓库 赋值?
      Object.defineProperty(window, "wechatide", { value: new i(r), writable: false, enumerable: false, configurable: false });
      Object.defineProperty(window, "pluginStorage", { value: new a(), writable: false, enumerable: false, configurable: false });
      // 创建事件触发器
      window.dispatchEvent(new CustomEvent("wechatideReady", { detail: window.wechatide }));
      window.dispatchEvent(new CustomEvent("pluginStorageReady", { detail: window.pluginStorage }));
    }
  },
  248: function(e, t, n) {
    // 跟socket有关,但是还没看具体做了什么, 看下面代码 应该是创建一个跟 微信通信的操作类
    const o = n(49);
    const r = (() => {
      let e = 1;
      return () => {
        return e++;
      };
    })();

    e.exports = class {
      constructor(e) {
        // writable  不可以采用 数据运算符 进行赋值
        // enumerable 不可以枚举
        // configurable 不可以修改, 不可以删除.
        Object.defineProperty(this, "__callbackMap", { value: {}, writable: false, enumerable: false, configurable: false });
        Object.defineProperty(this, "__onEvent", { value: {}, writable: false, enumerable: false, configurable: false });
        Object.defineProperty(this, "__messager", { value: new o(`PLUGIN_${e}`), writable: false, enumerable: false, configurable: false });
        this.__messager.registerCallback(e => {
          let { command: t, data: n } = e;
          if ("INVOKE_CALLBACK" === t) {
            let { callbackID: e, res: t } = n;
            let o = this.__callbackMap[e];
            if (o) {
              // 调用apid的回调
              if ("function" == typeof o.callback) {
                o.callback(t);
              }
              // 支持promise? 没发现啊
              if ("function" == typeof o.resolve) {
                o.resolve(t);
              }
            }
            // 应该是清理当前这个事件?
            delete this.__callbackMap[e];
          } else if ("ON_EVENT" === t) {
            // 绑定的事件回调
            let { eventName: e, res: t } = n;
            let o = this.__onEvent[e];
            if ("function" == typeof o) {
              o(t);
            }
          }
        });
      }
      get invoke() {
        // 对外抛出  invoke() 方法调用
        return (e, t, n) =>
          // 也就是说微信这个目前是支持 invoke使用promise方式去处理结果的,有进步啊.
          new Promise(o => {
            this.__messager.send({
              command: e,
              data: t,
              callbackID: function(e, t) {
                const n = r();
                this.__callbackMap[n] = { callback: e, resolve: t };
                return n;
              }.call(this, n, o)
            });
          });
      }
      get on() {
        // 对外抛出  on() 方法调用
        return (e, t) => {
          this.__onEvent[e] = t;
        };
      }
    };
  },
  249: function(e) {
    // 插件相关,通过 wechat ide 对插件进行操作
    e.exports = class {
      constructor() {}
      async getItem(e) {
        return (await window.wechatide.invoke("PLUGIN_STORAGE_GET_ITEM", { key: e })).value;
      }
      async setItem(e, t) {
        await window.wechatide.invoke("PLUGIN_STORAGE_SET_ITEM", { key: e, value: t });
      }
      async removeItem(e) {
        await window.wechatide.invoke("PLUGIN_STORAGE_REMOVE_ITEM", { key: e });
      }
    };
  },
  49: function(e) {
    // 这里也是个跟 socket 相关的,可能微信调试环境用的这个?
    var t = window.navigator || window.__global.navigator;
    var n = window.WebSocket || window.__global.WebSocket;
    var o = t.userAgent.match(/port\/(\d*)/);
    var r = `ws://127.0.0.1:${o ? parseInt(o[1]) : 9974}`;
    e.exports = class {
      constructor(e) {
        this._protocol = e;
        this._ws = null;
        this._msgQueue = [];
        this._callback = [];
        if ("complete" == document.readyState) {
          setTimeout(() => {
            this.connect();
          }, 0);
        } else {
          window.addEventListener("load", () => {
            this.connect();
          });
        }
      }
      // 创建 socket 链接
      connect() {
        const e = prompt("GET_MESSAGE_TOKEN");
        this._ws = new n(r, `${this._protocol}#${e}#`);
        this._ws.onopen = () => {
          let e = [...this._msgQueue];
          this._msgQueue = [];
          e.forEach(e => {
            this.send(e);
          });
        };
        this._ws.onclose = () => {
          this._ws = null;
          setTimeout(() => {
            this.connect();
          }, 0);
        };
        this._ws.onmessage = e => {
          try {
            let t = JSON.parse(e.data);
            this._callback.forEach(e => {
              try {
                e.call(this, t);
              } catch (e) {}
            });
          } catch (e) {}
        };
      }
      // 发情api消息
      send(e) {
        // 这块是 发送api调用信息用的
        if (this._ws && this._ws.readyState === n.OPEN) {
          this._ws.send(JSON.stringify(e));
        } else {
          // 如果 还没有链接上socket的话,就等连上再发,这里先给方法存到队列里
          this._msgQueue.push(e);
        }
      }
      // 事件注册回调
      registerCallback(e) {
        if ("function" == typeof e) {
          this._callback.push(e);
        }
      }
    };
  },
  65: function(e, t, n) {
    // 坑你是发送debug 相关的 内容吧 ? 猜的
    function o() {
      let e = `WEBDEBUGGER_${a}`;
      r.connect(e);
    }
    // 创建
    const r = n(20);
    // 可能是 获取 web view id 具体要看UA
    const i = navigator.userAgent.match(/webview\/([\w]*)/)[1];
    const a = `${Date.now()}${parseInt(1e4 * Math.random())}`;
    if ("readyState" == document.readyState) {
      o();
    } else {
      window.addEventListener("load", () => {
        o();
      });
    }
    e.exports = {
      send: function(e) {
        e.webviewID = i;
        e.runtimeID = a;
        r.send(e);
      },
      registerCallback: r.registerCallback
    };
  }
});
// 20 应该是 微信开发者工具用的, 49 那个是 微信用的
