import { sum } from "./math.js";
import count from "./count.js";

console.log("hello main");
console.log(sum(1, 2));

// 按钮点击事件

document.getElementById("btn").onclick = function () {
  // import 动态导入，会将动态导入的文件代码分割（拆分成单独模块），在需要使用的时候自动加载
  import("./count.js")
    .then((res) => {
      console.log(res.default(1, 2));
    })
    .catch((err) => {
      console.log(err);
    });
};
