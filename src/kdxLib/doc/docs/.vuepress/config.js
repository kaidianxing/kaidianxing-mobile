const path = require("path");
module.exports = {
  title: "开店星商城",
  base: "/", // 仓库名，表示部署到哪里
  markdown: {
    // markdown 插入代码时展示对应行数
    lineNumbers: true,
  },
  plugins: [
    [
      "iconfont-docs",
      {
        key: "font_1534025_05m1dal08uhw",
        fontClass: "icon-m-",
        fontFamily: "iconfont-m-",
      },
    ],
  ],
  themeConfig: {
    sidebar: {
      "/": [
        {
          title: "样式库",
          collapsable: true,
          children: [
            {
              title: "Button",
              path: "/",
            },
            {
              title: "RuiImg",
              path: "/img/",
            },
            {
              title: "Num",
              path: "/num/",
            },
            {
              title: "Item",
              path: "/item/",
            },
            {
              title: "Cell",
              path: "/cell/",
            },
            {
              title: "Field",
              path: "/field/",
            },
            {
              title: "Dialog",
              path: "/dialog/",
            },
            {
              title: 'Toast',
              path: "/toast/"
            },
            {
              title: 'Modal',
              path: "/modal/"
            },
            {
              title: 'DefaultPage',
              path: "/defaultPage/"
            }
          ],
        },
      ],
    },
  },
};
