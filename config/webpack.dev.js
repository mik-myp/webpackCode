const path = require("path"); // nodejs核心模块，专门用来处理路径问题
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  // 输出
  output: {
    // 所有文件的输出路径，__dirname是nodejs的全局变量，表示当前文件的目录的绝对路径
    path: undefined, // 开发模式没有输出，不需要指定输出目录
    // 入口文件打包输出文件名
    filename: "static/js/[name].js", // 将 js 文件打包输出到 static/js 目录下
    // 自动清空上次打包的内容
    // 原理：在打包前，将 path 整个目录内容清空，再进行打包
    clean: true, // 开发模式没有输出，不需要清空输出结果
    // 给打包输出的其他文件命名，[name]：取webpackChunkName
    chunkFilename: "static/js/[name].chunk.js",
    // 图片，字体等通过 type:asset 处理资源命名方式
    /* 
          将图片文件输出到 static/images 目录中
          将图片文件命名 [hash:10][ext][query]
          [hash:10] hash值取前10位
          [ext] 使用之前的文件扩展名
          [query] 保留之前的query参数
        */
    assetModuleFilename: "static/media/[hash:10][ext][query]",
  },
  // 加载器
  module: {
    rules: [
      {
        oneOf: [
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
            use: ["style-loader", "css-loader", "less-loader"],
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
          {
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
            // asset： 会转换成 base64
            // asset/resource： 将文件原封不动的输出，不会转换成 base64
            type: "asset/resource",
          },
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 只检查src下的文件
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // plugins的配置
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值就是这个配置，可以省略
      cache: true, // 开启缓存
      // 缓存目录
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ),
    }),
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 HTML 文件
      // 新的html文件有两个特点：1. dom结构和原来的一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  // 开发服务器：不会输出资源，在内存中编译打包
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR功能（只能用于开发环境，生产环境不需要了）
  },
  // 模式
  mode: "development",
  devtool: "cheap-module-source-map",
};
