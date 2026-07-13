# ytshortsdl.net → ytvidhub.com 引流改造说明

## 怎么用这个 zip
把里面的文件按相同的相对路径覆盖到你的项目里即可（`lib/`、`components/`、`messages/`）。
另外有一个手动操作：**删除 `components/TaskbarHeroPromoModal.tsx`**（已被 `YtVidHubPromoModal.tsx` 完全替代，我这边环境没法帮你在你的仓库里删文件，需要你自己删一下，不删也不影响运行，只是变成没人引用的死文件）。

## 改了什么

### 新增文件
- `lib/ytvidhub-promo.ts` —— 三个位置共用的工具函数：UTM 链接生成、localStorage 状态管理（记录"是否已点击过""各个位置的冷却时间"）
- `components/YtVidHubPromoModal.tsx` —— **进站弹窗**（原 `TaskbarHeroPromoModal.tsx` 改造而来，样式还原度很高，只是把 Taskbar Hero 的内容换成了 YTVidHub 的字幕下载卖点）
- `components/YtVidHubDownloadSuccessModal.tsx` —— **下载成功后弹窗**。做成了右下角滑入的小卡片，而不是全屏大弹窗——因为这个时机用户刚成功下载完一次，紧接着甩一个全屏弹窗体验会比较打扰，轻量卡片转化效果通常更好，你要是更想要和进站弹窗一样的全屏样式，告诉我一声，我再改。

### 修改文件
- `components/Banner.tsx` —— 顶部 banner 链接和配色从 base64pro.top 改成 ytvidhub.com（配色从橙红改成了蓝紫，和 YTVidHub 的字幕/AI 调性更搭，你如果想保持橙红也行，说一声）
- `messages/en.json` / `es.json` / `hi.json` —— 更新了 `banner` 这个 key 下面的三段文案（英/西/印地语），链接跳转逻辑不受语言影响
- `lib/gtag.ts` —— 新增了 3 个 GA 事件常量：`YTVIDHUB_PROMO_VIEW`、`YTVIDHUB_PROMO_CLICK`、`YTVIDHUB_PROMO_DISMISS`，都带 `placement` 参数区分来源
- `components/HeroSection.tsx`（首页主下载工具，你流量最大的页面）—— 换掉了旧的进站弹窗引用；在单个下载成功 + 批量 ZIP 下载成功后，触发下载成功弹窗（如果这次同时要弹问卷 SurveyModal，会优先弹问卷，跳过这次的 ytvidhub 弹窗，避免两个弹窗打架）
- `components/Mp3ToolSection.tsx`（`/shorts-to-mp3`，你流量第二大的页面）—— 同样接入了下载成功弹窗

## UTM 追踪方案
三个位置统一走 `lib/ytvidhub-promo.ts` 里的 `getYtVidHubUrl()`：
```
https://ytvidhub.com/?utm_source=ytshortsdl&utm_medium=entry_modal&utm_campaign=cross_promo
https://ytvidhub.com/?utm_source=ytshortsdl&utm_medium=download_success_modal&utm_campaign=cross_promo
https://ytvidhub.com/?utm_source=ytshortsdl&utm_medium=header_banner&utm_campaign=cross_promo
```
在 ytvidhub.com 的 GA4 里，按 `Session medium` 分组就能看出这三个入口分别带来多少流量、注册率、留存，方便你后续取舍。

配合 ytshortsdl.net 这边新增的 `ytvidhub_promo_view` / `ytvidhub_promo_click` / `ytvidhub_promo_dismiss` 三个事件（带 `placement` 参数），两边数据一对，就能算出完整的曝光 → 点击 → 到站转化漏斗。

## 频次控制逻辑（避免骚扰用户）
统一存在 localStorage 的 `ytvidhub_promo_v1` 里：
- 只要用户在任意一个位置点击过一次「立即跳转」，就记为 `clicked: true`，之后**三个位置都不再弹**（已经转化了，没必要继续骚扰）
- 进站弹窗被关闭后 14 天内不再弹
- 下载成功弹窗被关闭后 3 天内不再弹（这个位置转化意愿更强，冷却时间设得比进站弹窗短一些，但也不会每次下载都弹）
- 顶部 banner 常驻展示，不受频控逻辑影响（本身就不打扰）

## 还没覆盖到的地方（按需扩展）
出于你这次明确要的"进站+下载成功+banner"三个位置，我先把首页（流量最大）和 MP3 页（流量第二）的下载成功弹窗接好了。你还有 `no-watermark`、`4k-shorts-downloader`、`video-to-script-converter`、`shorts-thumbnail-tool` 这几个工具页各自有独立的下载/生成逻辑，如果也想接下载成功弹窗，把对应的 `.tsx` 文件发我，我按同样的模式接进去，几分钟的事。

另外顺手发现 `components/Footer.tsx` 里也有一条导流到 base64pro.top 的链接（"game hubs"），这个不在你这次要求的三个位置里，我没动它，需要的话告诉我。
