/**
 * @format
 * func:jweixin
 *
 */
let jweixin = (e, n) => {
    /**
     * 调用api操作方法
     */
    let invoke = (n, i, t) => {
      // alert(JSON.stringify(e.WeixinJSBridge));
      // alert(e.WeixinJSBridge);
      // 判断 微信 js (桥?) 微信封装的方法
      if (e.WeixinJSBridge) {
        // 调用
        WeixinJSBridge.invoke(n, mergeConfig(i), e => {
          // 回调
          complete(n, e, t);
        });
      } else {
        u(n, t);
      }
    };
    /**
     * 绑定事件
     */
    function bind(n, i, t) {
      // on 绑定事件
      if (e.WeixinJSBridge) {
        WeixinJSBridge.on(n, e => {
          if (t && t.trigger) {
            t.trigger(e);
          }
          complete(n, e, i);
        });
      } else if (t) {
        u(n, t);
      } else {
        u(n, i);
      }
    }
    /**
     * 合并 wx.config 的参数
     * @param {*} e
     */
    function mergeConfig(e) {
      e = e || {};
      e.appId = C.appId;
      e.verifyAppId = C.appId;
      e.verifySignType = "sha1";
      e.verifyTimestamp = `${C.timestamp}`;
      e.verifyNonceStr = C.nonceStr;
      e.verifySignature = C.signature;
      return e;
    }
    /**
     *
     */
    function r(e) {
      return {
        timeStamp: `${e.timestamp}`,
        nonceStr: e.nonceStr,
        package: e.package,
        paySign: e.paySign,
        signType: e.signType || "SHA1"
      };
    }
    function a(e) {
      return (e.postalCode = e.addressPostalCode), delete e.addressPostalCode, (e.provinceName = e.proviceFirstStageName), delete e.proviceFirstStageName, (e.cityName = e.addressCitySecondStageName), delete e.addressCitySecondStageName, (e.countryName = e.addressCountiesThirdStageName), delete e.addressCountiesThirdStageName, (e.detailInfo = e.addressDetailInfo), delete e.addressDetailInfo, e;
    }
    /**
     * 调用 或 绑定事件结果解析
     */
    function complete(e, n, i) {
      if ("openEnterpriseChat" == e) {
        n.errCode = n.err_code;
      }
      delete n.err_code;
      delete n.err_desc;
      delete n.err_detail;
      var t = n.errMsg;
      if (!t) {
        t = n.err_msg;
        delete n.err_msg;
        t = s(e, t);
        n.errMsg = t;
      }
      if (!i) {
        i = {};
      }
      if (i._complete) {
        i._complete(n);
        delete i._complete;
      }
      if (n.errMsg) {
        t = n.errMsg;
      } else {
        t = "";
      }
      // dubug 打印
      if (C.debug && !i.isInnerInvoke) {
        alert(JSON.stringify(n, null, 2));
      }
      var o = t.indexOf(":");
      switch (t.substring(o + 1)) {
        case "ok":
          if (i.success) {
            i.success(n);
          }
          break;
        case "cancel":
          if (i.cancel) {
            i.cancel(n);
          }
          break;
        default:
          // 没看懂为啥 fail 放最下面
          if (i.fail) {
            i.fail(n);
          }
          break;
      }
      if (i.complete) {
        i.complete(n);
      }
    }
    function s(e, n) {
      var i = e;
      var t = v[i];
      if (t) i = t;
      var o = "ok";
      if (n) {
        var r = n.indexOf(":");
        if ("confirm" == (o = n.substring(r + 1))) {
          o = "ok";
        }
        if ("failed" == o) {
          o = "fail";
        }
        if (-1 != o.indexOf("failed_")) {
          o = o.substring(7);
        }
        if (-1 != o.indexOf("fail_")) {
          o = o.substring(5);
        }
        o = o.replace(/_/g, " ");
        o = o.toLowerCase();
        if (!("access denied" != o && "no permission to execute" != o)) {
          o = "permission denied";
        }
        if ("config" == i && "function not exist" == o) {
          o = "ok";
        }
        if ("" == o) {
          o = "fail";
        }
      }
      return (n = i + ":" + o);
    }
    function d(e) {
      if (e) {
        for (var n = 0, i = e.length; n < i; ++n) {
          var t = e[n];
          var o = h[t];
          if (o) {
            e[n] = o;
          }
        }
        return e;
      }
    }
    /**
     * 当
     * @param {*} e
     * @param {*} n
     */
    function u(e, n) {
      if (!(!C.debug || (n && n.isInnerInvoke))) {
        var i = v[e];
        if (i) {
          e = i;
        }
        if (n && n._complete) {
          delete n._complete;
        }
        console.log('"' + e + '",', n || "");
      }
    }
    function l(e) {
      if (!(k || w || C.debug || x < "6.0.2" || V.systemType < 0)) {
        var n = new Image();
        V.appId = C.appId;
        V.initTime = A.initEndTime - A.initStartTime;
        V.preVerifyTime = A.preVerifyEndTime - A.preVerifyStartTime;
        N.getNetworkType({
          isInnerInvoke: true,
          success: function(e) {
            V.networkType = e.networkType;
            var i = "https://open.weixin.qq.com/sdk/report?v=" + V.version + "&o=" + V.isPreVerifyOk + "&s=" + V.systemType + "&c=" + V.clientVersion + "&a=" + V.appId + "&n=" + V.networkType + "&i=" + V.initTime + "&p=" + V.preVerifyTime + "&u=" + V.url;
            console.log("调用了 l(e) src");
            n.src = i;
          }
        });
      }
    }
    function p() {
      return new Date().getTime();
    }
    function f(n) {
      if (T) {
        if (e.WeixinJSBridge) {
          n();
        } else if (S.addEventListener) {
          S.addEventListener("WeixinJSBridgeReady", n, false);
        }
      }
    }
    function m() {
      if (!N.invoke) {
        N.invoke = function(n, i, t) {
          if (e.WeixinJSBridge) {
            WeixinJSBridge.invoke(n, mergeConfig(i), t);
          }
        };
      }
      N.on = function(n, i) {
        if (e.WeixinJSBridge) {
          WeixinJSBridge.on(n, i);
        }
      };
    }
    function g(e) {
      if ("string" == typeof e && e.length > 0) {
        var n = e.split("?")[0];
        var i = e.split("?")[1];
        n += ".html";
        if (void 0 !== i) {
          return n + "?" + i;
        } else {
          return n;
        }
      }
    }
    if (!e.jWeixin) {
      var h = {
        config: "preVerifyJSAPI",
        onMenuShareTimeline: "menu:share:timeline",
        onMenuShareAppMessage: "menu:share:appmessage",
        onMenuShareQQ: "menu:share:qq",
        onMenuShareWeibo: "menu:share:weiboApp",
        onMenuShareQZone: "menu:share:QZone",
        previewImage: "imagePreview",
        getLocation: "geoLocation",
        openProductSpecificView: "openProductViewWithPid",
        addCard: "batchAddCard",
        openCard: "batchViewCard",
        chooseWXPay: "getBrandWCPayRequest",
        openEnterpriseRedPacket: "getRecevieBizHongBaoRequest",
        startSearchBeacons: "startMonitoringBeacons",
        stopSearchBeacons: "stopMonitoringBeacons",
        onSearchBeacons: "onBeaconsInRange",
        consumeAndShareCard: "consumedShareCard",
        openAddress: "editAddress",
        showOptionMenu: "showOptionMenu"
      };
      var v = (function() {
        var e = {};
        for (var n in h) e[h[n]] = n;
        return e;
      })();
      var S = e.document;
      var I = S.title;
      var y = navigator.userAgent.toLowerCase();
      var _ = navigator.platform.toLowerCase();
      var k = !(!_.match("mac") && !_.match("win"));
      var w = -1 != y.indexOf("wxdebugger");
      var T = -1 != y.indexOf("micromessenger");
      var M = -1 != y.indexOf("android");
      var P = -1 != y.indexOf("iphone") || -1 != y.indexOf("ipad");
      var x = (function() {
        var e = y.match(/micromessenger\/(\d+\.\d+\.\d+)/) || y.match(/micromessenger\/(\d+\.\d+)/);
        return e ? e[1] : "";
      })();
      var A = { initStartTime: p(), initEndTime: 0, preVerifyStartTime: 0, preVerifyEndTime: 0 };
      var V = { version: 1, appId: "", initTime: 0, preVerifyTime: 0, networkType: "", isPreVerifyOk: 1, systemType: P ? 1 : M ? 2 : -1, clientVersion: x, url: encodeURIComponent(location.href) };
      var C = {};
      var L = { _completes: [] };
      var B = { state: 0, data: {} };
      f(() => {
        A.initEndTime = p();
      });
      var O = false;
      var E = [];
  
      var N = {
        config: function(e) {
          (C = e), u("config", e);
          var n = !1 !== C.check;
          f(function() {
            if (n)
              invoke(
                h.config,
                { verifyJsApiList: d(C.jsApiList) },
                (function() {
                  (L._complete = function(e) {
                    (A.preVerifyEndTime = p()), (B.state = 1), (B.data = e);
                  }),
                    (L.success = function(e) {
                      V.isPreVerifyOk = 0;
                    }),
                    (L.fail = function(e) {
                      L._fail ? L._fail(e) : (B.state = -1);
                    });
                  var e = L._completes;
                  return (
                    e.push(function() {
                      l();
                    }),
                    (L.complete = function(n) {
                      for (var i = 0, t = e.length; i < t; ++i) e[i]();
                      L._completes = [];
                    }),
                    L
                  );
                })()
              ),
                (A.preVerifyStartTime = p());
            else {
              B.state = 1;
              for (var e = L._completes, t = 0, o = e.length; t < o; ++t) e[t]();
              L._completes = [];
            }
          }),
            m();
        },
        ready: function(e) {
          0 != B.state ? e() : (L._completes.push(e), !T && C.debug && e());
        },
        error: function(e) {
          x < "6.0.2" || (-1 == B.state ? e(B.data) : (L._fail = e));
        },
        checkJsApi: function(e) {
          var n = function(e) {
            var n = e.checkResult;
            for (var i in n) {
              var t = v[i];
              t && ((n[t] = n[i]), delete n[i]);
            }
            return e;
          };
          invoke(
            "checkJsApi",
            { jsApiList: d(e.jsApiList) },
            ((e._complete = function(e) {
              if (M) {
                var i = e.checkResult;
                i && (e.checkResult = JSON.parse(i));
              }
              e = n(e);
            }),
            e)
          );
        },
        onMenuShareTimeline: function(e) {
          bind(
            h.onMenuShareTimeline,
            {
              complete: function() {
                invoke("shareTimeline", { title: e.title || I, desc: e.title || I, img_url: e.imgUrl || "", link: e.link || location.href, type: e.type || "link", data_url: e.dataUrl || "" }, e);
              }
            },
            e
          );
        },
        onMenuShareAppMessage: function(e) {
          bind(
            h.onMenuShareAppMessage,
            {
              complete: function(n) {
                "favorite" === n.scene ? invoke("sendAppMessage", { title: e.title || I, desc: e.desc || "", link: e.link || location.href, img_url: e.imgUrl || "", type: e.type || "link", data_url: e.dataUrl || "" }) : invoke("sendAppMessage", { title: e.title || I, desc: e.desc || "", link: e.link || location.href, img_url: e.imgUrl || "", type: e.type || "link", data_url: e.dataUrl || "" }, e);
              }
            },
            e
          );
        },
        onMenuShareQQ: function(e) {
          bind(
            h.onMenuShareQQ,
            {
              complete: function() {
                invoke("shareQQ", { title: e.title || I, desc: e.desc || "", img_url: e.imgUrl || "", link: e.link || location.href }, e);
              }
            },
            e
          );
        },
        onMenuShareWeibo: function(e) {
          bind(
            h.onMenuShareWeibo,
            {
              complete: function() {
                invoke("shareWeiboApp", { title: e.title || I, desc: e.desc || "", img_url: e.imgUrl || "", link: e.link || location.href }, e);
              }
            },
            e
          );
        },
        onMenuShareQZone: function(e) {
          bind(
            h.onMenuShareQZone,
            {
              complete: function() {
                invoke("shareQZone", { title: e.title || I, desc: e.desc || "", img_url: e.imgUrl || "", link: e.link || location.href }, e);
              }
            },
            e
          );
        },
        updateTimelineShareData: function(e) {
          invoke("updateTimelineShareData", { title: e.title, link: e.link, imgUrl: e.imgUrl }, e);
        },
        updateAppMessageShareData: function(e) {
          invoke("updateAppMessageShareData", { title: e.title, desc: e.desc, link: e.link, imgUrl: e.imgUrl }, e);
        },
        startRecord: function(e) {
          invoke("startRecord", {}, e);
        },
        stopRecord: function(e) {
          invoke("stopRecord", {}, e);
        },
        onVoiceRecordEnd: function(e) {
          bind("onVoiceRecordEnd", e);
        },
        playVoice: function(e) {
          invoke("playVoice", { localId: e.localId }, e);
        },
        pauseVoice: function(e) {
          invoke("pauseVoice", { localId: e.localId }, e);
        },
        stopVoice: function(e) {
          invoke("stopVoice", { localId: e.localId }, e);
        },
        onVoicePlayEnd: function(e) {
          bind("onVoicePlayEnd", e);
        },
        uploadVoice: function(e) {
          invoke("uploadVoice", { localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);
        },
        downloadVoice: function(e) {
          invoke("downloadVoice", { serverId: e.serverId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);
        },
        translateVoice: function(e) {
          invoke("translateVoice", { localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);
        },
        chooseImage: function(e) {
          invoke(
            "chooseImage",
            { scene: "1|2", count: e.count || 9, sizeType: e.sizeType || ["original", "compressed"], sourceType: e.sourceType || ["album", "camera"] },
            ((e._complete = function(e) {
              if (M) {
                var n = e.localIds;
                try {
                  n && (e.localIds = JSON.parse(n));
                } catch (e) {}
              }
            }),
            e)
          );
        },
        getLocation: function(e) {},
        previewImage: function(e) {
          invoke(h.previewImage, { current: e.current, urls: e.urls }, e);
        },
        uploadImage: function(e) {
          invoke("uploadImage", { localId: e.localId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);
        },
        downloadImage: function(e) {
          invoke("downloadImage", { serverId: e.serverId, isShowProgressTips: 0 == e.isShowProgressTips ? 0 : 1 }, e);
        },
        getLocalImgData: function(e) {
          !1 === O
            ? ((O = !0),
              invoke(
                "getLocalImgData",
                { localId: e.localId },
                ((e._complete = function(e) {
                  if (((O = !1), E.length > 0)) {
                    var n = E.shift();
                    wx.getLocalImgData(n);
                  }
                }),
                e)
              ))
            : E.push(e);
        },
        getNetworkType: function(e) {
          var n = function(e) {
            var n = e.errMsg;
            e.errMsg = "getNetworkType:ok";
            var i = e.subtype;
            if ((delete e.subtype, i)) e.networkType = i;
            else {
              var t = n.indexOf(":"),
                o = n.substring(t + 1);
              switch (o) {
                case "wifi":
                case "edge":
                case "wwan":
                  e.networkType = o;
                  break;
                default:
                  e.errMsg = "getNetworkType:fail";
              }
            }
            return e;
          };
          invoke(
            "getNetworkType",
            {},
            ((e._complete = function(e) {
              e = n(e);
            }),
            e)
          );
        },
        openLocation: function(e) {
          invoke("openLocation", { latitude: e.latitude, longitude: e.longitude, name: e.name || "", address: e.address || "", scale: e.scale || 28, infoUrl: e.infoUrl || "" }, e);
        },
        getLocation: function(e) {
          (e = e || {}),
            invoke(
              h.getLocation,
              { type: e.type || "wgs84" },
              ((e._complete = function(e) {
                delete e.type;
              }),
              e)
            );
        },
        hideOptionMenu: function(e) {
          invoke("hideOptionMenu", {}, e);
        },
        showOptionMenu: function(e) {
          console.log("显示菜单");
          invoke("showOptionMenu", {}, e);
        },
        closeWindow: function(e) {
          invoke("closeWindow", {}, (e = e || {}));
        },
        hideMenuItems: function(e) {
          invoke("hideMenuItems", { menuList: e.menuList }, e);
        },
        showMenuItems: function(e) {
          console.log("invike show menu items.");
          invoke("showMenuItems", { menuList: e.menuList }, e);
        },
        hideAllNonBaseMenuItem: function(e) {
          invoke("hideAllNonBaseMenuItem", {}, e);
        },
        showAllNonBaseMenuItem: function(e) {
          invoke("showAllNonBaseMenuItem", {}, e);
        },
        scanQRCode: function(e) {
          invoke(
            "scanQRCode",
            { needResult: (e = e || {}).needResult || 0, scanType: e.scanType || ["qrCode", "barCode"] },
            ((e._complete = function(e) {
              if (P) {
                var n = e.resultStr;
                if (n) {
                  var i = JSON.parse(n);
                  e.resultStr = i && i.scan_code && i.scan_code.scan_result;
                }
              }
            }),
            e)
          );
        },
        openAddress: function(e) {
          invoke(
            h.openAddress,
            {},
            ((e._complete = function(e) {
              e = a(e);
            }),
            e)
          );
        },
        openProductSpecificView: function(e) {
          invoke(h.openProductSpecificView, { pid: e.productId, view_type: e.viewType || 0, ext_info: e.extInfo }, e);
        },
        addCard: function(e) {
          for (var n = e.cardList, t = [], o = 0, r = n.length; o < r; ++o) {
            var a = n[o],
              c = { card_id: a.cardId, card_ext: a.cardExt };
            t.push(c);
          }
          invoke(
            h.addCard,
            { card_list: t },
            ((e._complete = function(e) {
              var n = e.card_list;
              if (n) {
                for (var i = 0, t = (n = JSON.parse(n)).length; i < t; ++i) {
                  var o = n[i];
                  (o.cardId = o.card_id), (o.cardExt = o.card_ext), (o.isSuccess = !!o.is_succ), delete o.card_id, delete o.card_ext, delete o.is_succ;
                }
                (e.cardList = n), delete e.card_list;
              }
            }),
            e)
          );
        },
        chooseCard: function(e) {
          invoke(
            "chooseCard",
            { app_id: C.appId, location_id: e.shopId || "", sign_type: e.signType || "SHA1", card_id: e.cardId || "", card_type: e.cardType || "", card_sign: e.cardSign, time_stamp: e.timestamp + "", nonce_str: e.nonceStr },
            ((e._complete = function(e) {
              (e.cardList = e.choose_card_info), delete e.choose_card_info;
            }),
            e)
          );
        },
        openCard: function(e) {
          for (var n = e.cardList, t = [], o = 0, r = n.length; o < r; ++o) {
            var a = n[o],
              c = { card_id: a.cardId, code: a.code };
            t.push(c);
          }
          invoke(h.openCard, { card_list: t }, e);
        },
        consumeAndShareCard: function(e) {
          invoke(h.consumeAndShareCard, { consumedCardId: e.cardId, consumedCode: e.code }, e);
        },
        chooseWXPay: function(e) {
          invoke(h.chooseWXPay, r(e), e);
        },
        openEnterpriseRedPacket: function(e) {
          invoke(h.openEnterpriseRedPacket, r(e), e);
        },
        startSearchBeacons: function(e) {
          invoke(h.startSearchBeacons, { ticket: e.ticket }, e);
        },
        stopSearchBeacons: function(e) {
          invoke(h.stopSearchBeacons, {}, e);
        },
        onSearchBeacons: function(e) {
          bind(h.onSearchBeacons, e);
        },
        openEnterpriseChat: function(e) {
          invoke("openEnterpriseChat", { useridlist: e.userIds, chatname: e.groupName }, e);
        },
        launchMiniProgram: function(e) {
          invoke("launchMiniProgram", { targetAppId: e.targetAppId, path: g(e.path), envVersion: e.envVersion }, e);
        },
        miniProgram: {
          navigateBack: function(e) {
            (e = e || {}),
              f(function() {
                invoke("invokeMiniProgramAPI", { name: "navigateBack", arg: { delta: e.delta || 1 } }, e);
              });
          },
          navigateTo: function(e) {
            f(function() {
              invoke("invokeMiniProgramAPI", { name: "navigateTo", arg: { url: e.url } }, e);
            });
          },
          redirectTo: function(e) {
            f(function() {
              invoke("invokeMiniProgramAPI", { name: "redirectTo", arg: { url: e.url } }, e);
            });
          },
          switchTab: function(e) {
            f(function() {
              invoke("invokeMiniProgramAPI", { name: "switchTab", arg: { url: e.url } }, e);
            });
          },
          reLaunch: function(e) {
            f(function() {
              invoke("invokeMiniProgramAPI", { name: "reLaunch", arg: { url: e.url } }, e);
            });
          },
          postMessage: function(e) {
            f(function() {
              invoke("invokeMiniProgramAPI", { name: "postMessage", arg: e.data || {} }, e);
            });
          },
          getEnv: function(n) {
            f(function() {
              n({ miniprogram: "miniprogram" === e.__wxjs_environment });
            });
          }
        }
      };
      var b = 1;
      var R = {};
      return (() => {
        S.addEventListener(
          "error",
          function(e) {
            if (!M) {
              var n = e.target,
                i = n.tagName,
                t = n.src;
              if (("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) && -1 != t.indexOf("wxlocalresource://")) {
                e.preventDefault(), e.stopPropagation();
                var o = n["wx-id"];
                if ((o || ((o = b++), (n["wx-id"] = o)), R[o])) return;
                (R[o] = !0),
                  wx.ready(function() {
                    wx.getLocalImgData({
                      localId: t,
                      success: function(e) {
                        n.src = e.localData;
                      }
                    });
                  });
              }
            }
          },
          true
        );
  
        S.addEventListener(
          "load",
          function(e) {
            if (!M) {
              var n = e.target,
                i = n.tagName;
              n.src;
              if ("IMG" == i || "VIDEO" == i || "AUDIO" == i || "SOURCE" == i) {
                var t = n["wx-id"];
                t && (R[t] = !1);
              }
            }
          },
          true
        );
        if (n) {
          e.jWeixin = N;
          e.wx = N;
        }
        return N;
      })();
    }
  };
  
  /**
   * 导出微信 js-sdk 模块
   * @description
   * ! 这里 umd 加载模块被我改写了,源码是在任何环境下都会创建 wx对象, 我这改成了 只有 存在 window.WeixinJSBridge 再去执行 创建 Jweixin
   */
  let wx = (() => {
    let e = window ? window : self ? self : {};
    //
    if (e.WeixinJSBridge) {
      console.log("---------------------------------------------");
      console.log(`js bridge:`, e.WeixinJSBridge.invoke);
      return jweixin(e, !0);
    } else {
      console.info("Info:当前不在微信浏览器环境内");
      return {};
    }
  })();
  module.exports = wx;
  