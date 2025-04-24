import {defineConfig} from "vitepress";
import {withI18n} from "vitepress-i18n";

const vitePressOptions = {
    base: "/",
    title: "NebulaBus",
    rewrites: {
        'en/:rest*': ':rest*'
    },
    themeConfig: {
        i18nRouting: true,
        socialLinks: [
            {icon: "github", link: "https://github.com/JiewitTech/NebulaBus"},
            {icon: "gitee", link: "https://gitee.com/jiewit-tech/NebulaBus"},
        ],
    },
};

const vitePressI18nOptions = {
    locales: [
        {path: "en", locale: "en"},
        {path: "zh", locale: "zhHans"},
    ],
    rootLocale: "en",
    themeConfig: {
        en: {
            nav: [{text: "Home", link: "/"}],
            sidebar: [
                {
                    text: "Documentation",
                    items: [
                        {text: "Quick Start", link: "/quick-start"},
                        {
                            text: "Disposition",
                            items: [
                                {text: 'Basic', link: '/disposition/basic'},
                                {
                                    text: 'Transport',
                                    items: [
                                        {text: 'Memory', link: '/disposition/transport/memory'},
                                        {text: 'Rabbitmq', link: '/disposition/transport/rabbitmq'},
                                    ]
                                },
                                {
                                    text: 'Store',
                                    items: [
                                        {text: 'Memory', link: '/disposition/store/memory'},
                                        {text: 'Redis', link: '/disposition/store/redis'},
                                    ]
                                },
                            ]
                        },
                        {text: "Message", link: "/message"},
                        {text: "Performance", link: "/performance"},
                        {text: "Stress Test", link: "/press-test"},
                        {text: "Star Me", link: "/star-me"},
                    ],
                },
            ],
        },
        zh: {
            nav: [{text: "首页", link: "/zh/"}],
            sidebar: [
                {
                    text: "文档（中文）",
                    items: [
                        {text: "快速开始", link: "/zh/quick-start"},
                        {
                            text: "配置",
                            items: [
                                {text: '基本配置', link: '/zh/disposition/basic'},
                                {
                                    text: '传输',
                                    items: [
                                        {text: '内存传输', link: '/zh/disposition/transport/memory'},
                                        {text: 'Rabbitmq', link: '/zh/disposition/transport/rabbitmq'},
                                    ]
                                },
                                {
                                    text: '存储',
                                    items: [
                                        {text: '内存存储', link: '/zh/disposition/store/memory'},
                                        {text: 'Redis', link: '/zh/disposition/store/redis'},
                                    ]
                                },
                            ]
                        },
                        {text: "消息", link: "/zh/message"},
                        {text: "高性能", link: "/zh/performance"},
                        {text: "压力测试", link: "/zh/press-test"},
                        {text: "点个赞吧", link: "/zh/star-me"},
                    ],
                },
            ],
        },
    },
};

export default defineConfig(withI18n(vitePressOptions, vitePressI18nOptions));
