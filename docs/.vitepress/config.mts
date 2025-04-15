import { defineConfig } from "vitepress";
import { withI18n } from "vitepress-i18n";

const vitePressOptions = {
  title: "NebulaBus",
  themeConfig: {
    i18nRouting: true,
    socialLinks: [
      { icon: "github", link: "https://github.com/JiewitTech/NebulaBus" },
    ],
  },
};

const vitePressI18nOptions = {
  locales: [
    { path: "en", locale: "en" },
    { path: "zh", locale: "zhHans" },
  ],
  rootLocale: "en",
  themeConfig: {
    en: {
      nav: [{ text: "Home", link: "/" }],
      sidebar: [
        {
          text: "Documentation",
          items: [
            { text: "Quick Start", link: "/quick-start" },
            { text: "Disposition", link: "/configuration" },
            { text: "Message", link: "/message" },
            { text: "Performance", link: "/performance" },
            { text: "Stress test", link: "/press-test" },
          ],
        },
      ],
    },
    zh: {
      nav: [{ text: "首页", link: "/" }],
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
    },
  },
};

export default defineConfig(withI18n(vitePressOptions, vitePressI18nOptions));
