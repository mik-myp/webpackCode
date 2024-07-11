// 打包的入口文件（主文件）
import count from "./js/count";
import sum from "./js/sum";
// 要想webpack能打包资源，必须引入该资源
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";

import "./css/iconfont.css";

import { sub } from './js/math'

console.log(sub(1, 1));
var result1 = count(2, 1);
console.log(result1);
var result2 = sum(1, 2, 3, 4, 5, 6);
console.log(result2);


// 判断是否支持HMR功能
if (module.hot) {
  module.hot.accept("./js/count.js", function (count) {
    const result1 = count(2, 1);
    console.log(result1);
  });

  module.hot.accept("./js/sum.js", function (sum) {
    const result2 = sum(1, 2, 3, 4);
    console.log(result2);
  });
}