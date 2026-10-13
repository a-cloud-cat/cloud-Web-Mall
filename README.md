# Cloud Mall Admin Web

`cloudMall` 微服务项目的后台前端，基于 **Vue 3 + Vite 8 + Element Plus 2**，纯 JavaScript，不引 TypeScript / sass / Pinia 等重量级工具链。

> 功能范围和交互参考 [mall-admin-web-master](https://github.com/macro-zheng/mall-admin-web)，但用更现代的写法重新实现。

## 快速开始

```powershell
npm.cmd install       # 安装依赖
npm.cmd run dev       # 开发 (http://localhost:5173)
npm.cmd run build     # 生产构建
npm.cmd run preview   # 预览构建产物
```

## 技术栈

| 依赖 | 版本 | 用途 |
|---|---|---|
| Vue | ^3.5 | 核心框架 |
| Vue Router | ^4.6 | 路由（hash 模式） |
| Vite | ^8.3 | 构建工具 |
| Element Plus | ^2.14 | UI 组件库 |
| @element-plus/icons-vue | ^2.3 | 图标 |
| Axios | ^1.20 | HTTP 请求 |

## 项目结构

```
src/
├── router/index.js       # 路由表
├── views/
│   ├── layout/           # Layout 骨架（Sidebar + AppMain）
│   └── home/index.vue    # 首页
├── App.vue
├── main.js
└── style.css
```

## License

MIT
