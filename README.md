
JavaScript SDK for [eleme/perf](https://github.com/eleme/perf).
----

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

最新版本 https://github.elemecdn.com/eleme/perf-js/1.2.1/dist/perf.min.js

支持的功能:

* 报告页面启动的时间参数
* 报告运行时错误
* 报告静态资源加载的时间参数
* 支持提交 Etrace 需要的 requestId 和网络信息
* 报告指定的 DOM 事件信息
* 自定义事件

更多关于前端发送的数据格式, 查看[事件类型](https://github.com/eleme/perf-js/wiki/Event-Specs).

[更新日志](https://github.com/eleme/perf-js/releases), 其中:

* HTTP Warning 从 `1.2.0` 开始提供
* `network` 从 `1.1.16` 开始提升为超级属性
* `perf.sendEvent()` 从 `1.1.12` 开始提供
* `pageName` 属性从 `1.1.11` 开始提供
* `appName` 属性从 `1.1.9` 开始提供

### Before start

Metrics will be processed with custom directives at [Perf Web](https://perf.ele.me).
Despite everything being sent over HTTPS, sensitive data can leak in the code thus it's not recommended to be sent with SDK.

Data is collected in real-time but it takes 3 mins for the collectors to transform it into a human readable format.
And as you can imagine that the sources can be huge, thus, by default the data will be expired in 30 days.

### 使用和配置

在关闭标签 `</body>` 之前引入 Perf 源码文件:

```html
<script src="//github.elemecdn.com/eleme/perf-js/1.2.1/dist/perf.min.js"></script>
```

Perf 支持配置用于开启关闭某些功能/设置版本号等等, 请写在引用 Perf 的 `<script>` 之前:

```html
<script>
  // (可选), 在 Perf.js 代码前配置这个变量, 用于控制 Perf 的行为
  window.ElemePerfConfigs = {
    appVer: '0.0.1',
    // appName: '[project-name]', // 可选, 项目名称, 默认 location.hostname
    // pageName: '[page-name]', // 可选, 页面名称
    // trackerDomain: 'https://perf.ele.me' // 只在调试当中使用, 更改 gif 文件的请求

    // 新版本 Perf 默认读取 God 配置, 修改配置请访问 https://perf.ele.me/#/personal/setting
    // 本地的配置**将会**覆盖 God 的配置. 建议不配置 `sendingTypes`, 直接使用 God 配置.

    // 检测 window 上是否能获取到该全局变量, 比如设置检查 ['Promise', 'fetch']
    // 可选, 默认 [] 表示不检查任何变量
    // 某些全局变量未 polyfill 成功会导致白屏. Perf 在页面下方弹出提示, 往 God 发送事件报告
    ensureVariables: [],

    sendingTypes: {
      load:   true,   // 报告启动时间, 默认 true, 设置 false 以关闭服务
      error:  true,   // 报告运行错误
      event:  true,   // 报告 DOM 事件
      asset:  false,  // 报告资源加载的网络时间
      http:   true,   // 报告 HTTP 资源的请求地址, 对应事件 http-warning
      api:    false   // 报告 JSON 请求数据, 设置 Etrace 的跨域 Header `X-ELEME-RequestID`
                      // 默认 false, 需要确定后端完全支持 Header 再开启
    },
    etraceApiFilter: /(^\/)|(ele(net)?\.me)/ // 开启 api 选项时, 用于过滤域名
  };
</script>
<script src="//github.elemecdn.com/eleme/perf-js/1.2.1/dist/perf.min.js"></script>
```

> 注意: `api` 选项在跨域 Header 上增加字段, 可能导致 HTTP 请求报错, 需要服务器开启 `X-ELEME-RequestID` 字段. 请在开启 `api` 选项之前确认服务器已经支持该字段.

### 自定义事件

发送自定义事件时会自动带上全局属性, 生成一个 `type` 为 `event` 的对象,
具体格式参考[事件类型](https://github.com/eleme/perf-js/wiki/Event-Specs), 并遵循业务的约定.
一个事件的例子比如:

```html
<script>
  perf.sendEvent({        // 自定义事件使用固定的 type 字段 "event"
    name: '[project/my-id]',  // 定义事件的 id, 比如 "perf-js/example"
    id: '[id]',               // 需要申请,
    data: {                   // 添加其他参数
      key1: 'value1',
      key2: 'value2'
    }
  });
</script>
```

第二个参数的对象尽量设计成扁平, 以便传输体积和后台分析的方便.

### DOM 事件

一些 DOM 事件可以通过简单的配置来自动实现, 用 `perf-EVENT` 的格式来指定:

```html
<button perf-click="project/id" perf-id="1" perf-route="2-1">checkout</button>
<select perf-change="project/id" perf-id="2"></select>

<!--
  `perf-data` show be a JSON string
  if you use angular.js, it works like:
  <input perf-focus="project/id" perf-data="{{ obj | json }}">
-->
<input perf-focus="project/id"
       perf-id="3"
       perf-data='{"foo":"bar","hello":["w","o","r","l","d"]}'>
```

注意 `id` 需要向 God 进行申请.

### 页面启动信息

Perf 会自动探测并提交站点的性能相关信息, 完整内容比如:

```js
{
  "id": "http://eleme.io/perf-js/test/",    // 页面 id, 一般为 url
  "sdkVer": "1.2.1",                       // Perf 代码的版本
  "appVer": "0.0.1",                        // 页面代码的版本
  "type": "load",                           // 事件类型
  "d": {
    "lookup": 0,
    "connect": 0,
    "waiting": 1,
    "receiving": 1,
    "parsing": 74,
    "contentLoaded": 89,
    "pageLoaded": 93
  }
}
```

细节请查阅[网络相关属性](https://github.com/eleme/perf-js/wiki/Load-Event).

### Error

页面当中的报错会被 Perf 自动捕捉并提交. 重复的报错只有第一个会被提交.

### Debug

可以通过修改 `window.PERF_DEBUG` 方法在开发环境打印 Perf 发出的信息:

```html
<script>window.PERF_DEBUG = (message) => console.log(message);</script>
```

也可以通过配置 `trackerDomain` 属性修改提交信息的地址, 用于开发:

```js
window.ElemePerfConfigs = {
  trackerDomain: 'https://localhost:3000' // 只在调试当中使用, 更改 gif 文件的请求
};
```

这是可以启动一个 Node.js 脚本监听本机的 `3000` 端口:

```bash
node example/server.js
```

示例页面在 `example/index.html`, 注意编译代码后再打开.

### Develop

[开发说明](https://github.com/eleme/perf-js/wiki/Develop)

常用命令:

* `make build` 打包代码
* `npm run lint` 运行 eslint

Tests based on https://leozdgao.me/modern-karma/
