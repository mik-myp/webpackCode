const path = require("path"); // nodejs核心模块，专门用来处理路径问题

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  // 输出
  output: {
    // 文件的输出路径，__dirname是nodejs的全局变量，表示当前文件的目录的绝对路径
    path: path.resolve(__dirname, "dist"), // 绝对路径
    // 文件名
    filename: "main.js",
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/, // 只检测.css文件，只有.css文件才会使用下面的规则
        use: [
          // 执行顺序：从右向左（从下到上）执行
          "style-loader", // 将js中css通过创建的style标签添加到html文件中
          "css-loader", // 将css资源编译成commonjs的模块到js中
        ],
      },
      {
        test: /\.less$/,
        // loader: "xxx", // 只能使用一个loader
        use: [
          // 执行顺序：从右向左（从下到上）执行
          "style-loader", // 将js中css通过创建的style标签添加到html文件中
          "css-loader", // 将css资源编译成commonjs的模块到js中
          "less-loader", // 将less文件编译成css文件
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024, // 小于10kb的图片会被base64处理
          },
        },
      },
    ],
  },
  // 插件
  plugins: [
    // plugins的配置
  ],
  // 模式
  mode: "development",
};
