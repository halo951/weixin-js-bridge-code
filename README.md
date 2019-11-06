### 微信浏览器 JsBridge 及 js-sdk 源码分析

> update time:2019 年 11 月 6 日 16:56:36
> 先来点实在的东西

#### 微信真实可用接口(能在 jsbridge 中,找到的) 
> 可能不太对,比如 hideAllNonBaseMenuItem()方法,有效但是这里面没有

```
        // 以下是微信jsBridge 对外抛出的接口
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
        showPickerView: "showPickerView", //  选择视图  一般是底部选项菜单? android 和ios 应该不一样吧,但是应该调用的是微信的.
        showDatePickerView: "showDatePickerView" // 打开时间选择器
```

#### tips

1. jsBridge 源码是从微信开发者工具粘出来的.
2. 微信通过 `e.preventDefault(), e.stopPropagation();` 阻断 浏览器的 拖拽,拖放操作, 这个理论上能解决左右划切出网页问题,没有具体测试。 参考 wx.js line:410
3. jsBridge 根据不同环境,有不同程度的 window 方法覆盖,参考 wx.js line: 125
4. 微信阻断了网页间通信逻辑,通过 window.addEventListener("message")实现,理论上可以通过移除或者重写这个事件,来解决这个问题.
5. 微信 js 对象真实支持情况参考 wx.js func:237
6. 里面有两个 socket 20 和 49,猜测是根据开发者工具和 微信内,各自用各自的.
7. 猜测小程序的发布流程 跟 vue 打包类似,只不过 App 这个对象是微信对 window 的封装，因为很可能小程序也是用 chrome 的核然后,外面套了个 jsBridge 的皮,放出来的.
8. 微信的 js api 现在应该是支持了 Promise 的 ,可以 asnyc(await) 了。但是文档里面好像没有说.

#### 微信 jsBridge 运作流程分析

1. 到网页加载完成后,加载 jsBridge 的代码,如果没加载完,就放在 对应的 `ready`事件里调用.
2. 判断不同环境,然后覆盖 window 对象,暴露出微信允许的变量.
3. 源码里面有几个 创建 class 的方法,猜测这几个就是 api 的操作类
4. 在 微信处理好 window 对象后,会去 创建 webSocket, 目测是连接到本地的 9974 端口(微信监听端口).
5. socket 创建后,会先扫一下 queue 看看有没有在 socket 建立前发起的 api 请求,有的话发送给微信
6. 剩下的就是监听 socket 请求,然后发送了。他们发送的 socket 报文应该有个格式,具体是什么没看出来。里面有些拆分字符串的逻辑,搜 match() 可以搜到

#### jsBridge 大致方法描述 wx.js

> 代码阅读逻辑可以不用考虑 69 行以前的代码,这部分是抛出对象方法用的
> 下方的方法阅读 按照方法名(就方法名的数字(源码是什么,不知道,具体功能是根据代码操作猜出来的))

```
20: 这个方法应该是打开跟微信 通信的 socket 用的 (猜测微信开发者工具使用)
233: 这个方法 使用来 获取 userAgent 标识, 以及判断不同环境下,要封禁的 window 的一些属性用的, 注意,小程序有单独的处理逻辑的
234: 监听 window消息推送,但是对于位置选择器会有一个特殊的处理逻辑,但是其他情况下不允许界面通信
235: 用来覆盖window对象,就api中微信允许使用的对象,这里是直接给window对象改了,像alert弹窗这些方法,也在这里面被覆盖了
236: 这个方法 是用来过滤window对象允许操作的规则的. 大概属于 235的 子方法
237：这个方法是用来定义window 规则的. 跟236类似,在js里面调用的对象,实际支持情况就在这里面
238: 阻断拖拽,拖放事件
239: 阻断 ctrl 键 + 鼠标滚轮缩放网页用的
240: 阻断网页右键菜单,因为微信用的 chrome的核,
241: 清理 window touch相关事件,然后将 WeixinJSBridge 挂到window对象上抛出 * 注意:这个应该是一个入口方法,因为后面的逻辑好像都从这里出去的
242: 242 是封装了一个 jsBridge 的对象壳,打印出来的就是这个
243: jsBridge invike 操作相关
244: 获取 sdk 支持接口列表 ? 猜测
245: 开放api列表 和 不能显示的api配置?
246: 应该是debug方法的注册完成回调, 猜测 65是 dubug的逻辑
247: 这里看起来是处理插件相关的逻辑
248: 跟socket有关,看下面代码 应该是创建一个跟 微信通信的操作类
249: 插件相关,通过 wechat ide 对插件进行操作
49: 这里也是个跟 socket 相关的,可能微信调试环境用的这个?
65: 可能是发送debug 相关的 内容吧 ? 猜的

// 20 应该是 微信开发者工具用的, 49 那个是 微信用的

```

#### jweixin js-sdk

> 源码大概拆了下,只有两个逻辑 判断 `WeixinJSBridge` 对象是否存在 和 调用 `invike` 和 `on` 方法
> 官网的 api 跟 sdk 的差不多,但是跟 JsBridge 支持的 差了些内容。具体开发 以 JsBridge 为准就好了.
