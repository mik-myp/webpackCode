const os = require("os");
const path = require("path"); // nodejs核心模块，专门用来处理路径问题
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// cpu核数
const threads = os.cpus().length;

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
      {
        // oneOf：只能匹配上一个 loader, 剩下的就不匹配了
        oneOf: [
          // loader的配置
          {
            test: /\.css$/, // 只检测.css文件，只有.css文件才会使用下面的规则
            use: getStyleLoaders(),
          },
          {
            test: /\.less$/, // 只检测.less文件
            // loader: "xxx", // loader：只能使用一个loader
            use: getStyleLoaders("less-loader"), // use:使用多个loader，从下到上（从右到左）
          },
          {
            test: /\.s[ac]ss$/, // 只检测.sass 或者 .scss 文件
            use: getStyleLoaders("sass-loader"),
          },
          {
            test: /\.styl$/, // 只检测.styl文件
            use: getStyleLoaders("stylus-loader"),
          },
          {
            test: /\.(png|jpe?g|gif|webp)$/, // 只检测.png .jpg .gif .webp
            type: "asset", // asset：会转换成 base64
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
            test: /\.(ttf|woff2?|mp3|mp4|avi)$/, // 只检测.ttf .woff .woff2 .mp3 .mp4 .avi
            type: "asset/resource", // asset/resource： 将文件原封不动的输出，不会转换成 base64
            generator: {
              filename: "static/media/[hash:10][ext][query]",
            },
          },
          {
            test: /\.js$/, // 只检测.js文件
            // 以下是两种写法，只能生效一个
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 只检查src下的文件
            use: [
              {
                loader: "thread-loader", // 开启多进程
                options: {
                  workers: threads, // 数量
                },
              },
              {
                loader: "babel-loader", // 预设：指示babel做怎么样的兼容性处理
                options: {
                  cacheDirectory: true, // 开启babel编译缓存
                  cacheCompression: false, // 缓存文件不要压缩
                  plugins: ["@babel/plugin-transform-runtime"], // 减少代码体积
                },
              },
            ],
          },
        ],
      },
    ],
  },
  // 插件
  plugins: [
    // eslint插件
    new ESLintWebpackPlugin({
      context: path.resolve(__dirname, "../src"), // 指定检查文件的根目录
      exclude: "node_modules", // 默认值就是这个配置，可以省略
      cache: true, // 开启缓存
      cacheLocation: path.resolve(
        __dirname,
        "../node_modules/.cache/.eslintcache"
      ), // 缓存目录
      threads, // 开启多进程
    }),
    // html插件
    new HtmlWebpackPlugin({
      // 模板：以 public/index.html 文件创建新的 HTML 文件
      // 新的html文件有两个特点：1. dom结构和原来的一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"), // 模板路径
    }),
    // 提取 css 成单独文件插件
    new MiniCssExtractPlugin({
      filename: "static/css/main.css", // 定义输出文件名和目录
    }),
    // css压缩
    // new CssMinimizerPlugin(),
  ],
  // 压缩配置
  optimization: {
    minimize: true,
    minimizer: [
      // css压缩也可以写到optimization.minimizer里面，效果一样的
      new CssMinimizerPlugin(),
      // 当生产模式会默认开启TerserPlugin，但是我们需要进行其他配置，就要重新写了
      new TerserPlugin({
        parallel: threads, // 开启多进程
      }),
      // 压缩图片
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminGenerate,
          options: {
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              [
                "svgo",
                {
                  plugins: [
                    "preset-default",
                    "prefixIds",
                    {
                      name: "sortAttrs",
                      params: {
                        xmlnsOrder: "alphabetical",
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  // 模式
  mode: "production",
  devtool: "source-map", // 源代码映射
};
