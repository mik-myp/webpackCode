const path = require("path"); // nodejs核心模块，专门用来处理路径问题
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

// 获取处理样式的Loaders
const getStyleLoaders = (preProcessor) => {
  return [
    MiniCssExtractPlugin.loader,
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [
            "postcss-preset-env", // 能解决大多数样式兼容性问题
          ],
        },
      },
    },
    preProcessor,
  ].filter(Boolean);
};

module.exports = {
  // 入口
  entry: "./src/main.js", // 相对路径
  // 输出
  output: {
    // 所有文件的输出路径，__dirname是nodejs的全局变量，表示当前文件的目录的绝对路径
    path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
    // 入口文件打包输出文件名
    filename: "static/js/main.js", // 将 js 文件打包输出到 static/js 目录下
    // 自动清空上次打包的内容
    // 原理：在打包前，将 path 整个目录内容清空，再进行打包
    clean: true,
  },
  // 加载器
  module: {
    rules: [
      // loader的配置
      {
        test: /\.css$/, // 只检测.css文件，只有.css文件才会使用下面的规则
        use: getStyleLoaders(),
      },
      {
        test: /\.less$/,
        // loader: "xxx", // 只能使用一个loader
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      {
        test: /\.(png|jpe?g|gif|webp)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024, // 小于10kb的图片会被base64处理
          },
        },
        generator: {
          /* 
            将图片文件输出到 static/images 目录中
            将图片文件命名 [hash:10][ext][query]
            [hash:10] hash值取前10位
            [ext] 使用之前的文件扩展名
            [query] 保留之前的query参数
          */
          filename: "static/images/[hash:10][ext][query]",
        },
      },
      {
        test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
        // asset： 会转换成 base64
        // asset/resource： 将文件原封不动的输出，不会转换成 base64
        type: "asset/resource",
        generator: {
          /* 
            将字体文件输出到 static/media 目录中
            将字体文件命名 [hash:10][ext][query]
            [hash:10] hash值取前10位
            [ext] 使用之前的文件扩展名
            [query] 保留之前的query参数
          */
          filename: "static/media/[hash:10][ext][query]",
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/, // 排除node_modules代码不编译
        loader: "babel-loader",
        // options: {
        //   presets: ["@babel/preset-env"],
        // }
      },
    ],
  },
  // 插件
  plugins: [
    // plugins的配置
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 HTML 文件
      // 新的html文件有两个特点：1. dom结构和原来的一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/main.css",
    }),
    // css压缩
    new CssMinimizerPlugin(),
  ],
  // 模式
  mode: "production",
};
