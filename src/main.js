// 完整引入
// import "core-js";
// 按需加载
import "core-js/es/promise";

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

var result1 = count(2, 1);
console.log(result1);
var result2 = sum(1, 2, 3, 4, 5, 6);
console.log(result2);

document.getElementById("btn").onclick = function () {
  // eslint 不能识别动态导入，需要额外追加配置
  // webpackChunkName: "math"：webpack魔法命名，打包后的文件名
  import(/* webpackChunkName: "math",webpackPrefetch: true */ "./js/math").then(
    (res) => {
      console.log(res.sub(1, 1));
    }
  );
};

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

new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});

const arr = ["a", "b", "c"];

console.log(arr.includes("a"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
