import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "NebulaBus",
  description:
    "NebulaBus - High performance NET Distributed Event Bus Framework",
  themeConfig: {
    i18nRouting: false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
    ],

    sidebar: [
      {
        text: "文档（中文）",
        items: [
          { text: "快速开始", link: "/zh/quick-start" },
          { text: "配置", link: "/zh/configuration" },
          { text: "消息", link: "/zh/message" },
          { text: "高性能", link: "/zh/performance" },
          { text: "压力测试", link: "/zh/press-test" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/JiewitTech/NebulaBus" },
    ],
  },
  locales: {
    root: {
      label: "English",
      lang: "en-US",
    },
    zh: {
      label: "简体中文",
      lang: "zh-CN",
    },
  },
});
