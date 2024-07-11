const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/* 多入口 */
module.exports = {
  // entry: "./src/app.js", // 只有一个入口文件：单入口
  entry: {
    // 多个入口文件：多入口
    app: "./src/app.js",
    main: "./src/main.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js", // webpack 命名方式，[name]以文件名自己命名，例如上方入口的key值：app.js；main.js
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public/index.html"),
    }),
  ],
  mode: "production",
};
