# 小困插件工坊

> DeepSeek Harness 的小困（女仆）插件总览站。
> 线上地址：**https://valorine97417.github.io/dsh-maid-plugins/**

装一个包，走到哪都是小困。

---

## 这个站是什么

给老大的小困插件做的展示页——七个包，各管一摊：人设与记忆、视觉与渲染、环境与工具、维护层。

纯静态站：一个 `index.html` + `assets/`，无构建、无依赖、无外链字体。直接扔到 GitHub Pages 就能跑。

## 收录的插件

| 插件 | 版本 | 分类 | 一句话 |
|---|---|---|---|
| [dsh-maid-preset](https://github.com/Valorine97417/dsh-maid-preset) | 0.7.3 | 人设与记忆 | 自带 maid 预设、全局女仆人设与内置记忆 meow-memory。装一个包，走到哪都是小困。 |
| [dsh-maid-vcp](https://github.com/Valorine97417/dsh-maid-vcp) | 0.6.10 | 视觉与渲染 | 消息 HTML 渲染 + vcp-fast 加速引擎 + 内置 7 款开源字体 + 设计规范注入。 |
| [dsh-maid-scenery](https://github.com/Valorine97417/dsh-maid-scenery) | 0.2.2 | 视觉与渲染 | 深海女仆工坊：视频背景、静态画主题、融合切换三合一。 |
| [dsh-maid-comfyui](https://github.com/Valorine97417/dsh-maid-comfyui) | 0.5.4 | 环境与工具 | 让 Agent 智能驱动本地或远程 ComfyUI 生成任何内容。 |
| [dsh-maid-tts-fix](https://github.com/Valorine97417/dsh-maid-tts-fix) | 0.2.0 | 维护层 | 朗读与音色维护层：跨行 style/script 剥离 + 启动自检。 |
| [dsh-maid-patch-kit](https://github.com/Valorine97417/dsh-maid-patch-kit) | 0.1.0 | 维护层 | 给社区插件打不阻碍上游更新的维护补丁。 |
| [dsh-maid-lane-fix](https://github.com/Valorine97417/dsh-maid-lane-fix) | 0.2.0 | 环境与工具 | 免费车道中间层与上游补丁器。 |

其中 `dsh-maid-scenery` 与 `dsh-maid-comfyui` 为私有仓库，未登录访问会 404——卡片上已标「私有」。

## 站点结构

```
dsh-maid-plugins/
├── index.html              单页站点
├── assets/
│   ├── style.css           深海蕾丝·女仆工坊（abyss-maid）风格
│   ├── app.js              筛选 / 复制 / 灯箱 / 滚动淡入
│   └── img/                插件效果图（从各插件仓库拷贝）
├── .nojekyll               关掉 Jekyll，保住 assets/ 下的下划线路径
├── LICENSE                 MIT
└── README.md               本文件
```

## 视觉说明

风格取自 `dsh-maid-vcp/styles/abyss-maid.md`——深海蕾丝·女仆工坊：

- 底色 `#0a1428`（深海），卡片 `#121F41`，柔金 `#c5a468`，陶瓷白 `#f8f6f0`
- 金色只做线不做面；亮块全站至多一处（首屏 VCP 效果图）
- 标题走系统宋体骨（`Songti SC / Noto Serif SC`），正文系统无衬线，数字 `tabular-nums`
- 不引外链字体、不引 CDN——GitHub Pages 在国内本来就慢，字体再拖一个就废了

## 部署

Pages 源：`main` 分支 / 根目录。没有构建步骤，push 完等一分钟即可。

```bash
git clone https://github.com/Valorine97417/dsh-maid-plugins
# 改完直接推
git add -A && git commit -m "update site" && git push
```

## 本地预览

直接双击 `index.html`，或者：

```bash
npx serve .
```

## 许可

MIT © 2026 Valorine97417
