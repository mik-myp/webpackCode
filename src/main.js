// 打包的入口文件（主文件）
import count from "./js/count";
import sum from "./js/sum";
// 要想webpack能打包资源，必须引入该资源
import "./css/index.css";
import "./less/index.less";
import "./sass/index.sass";
import "./sass/index.scss";
import "./styl/index.styl";


console.log(count(1, 2));
console.log(sum(1, 2, 3, 4));
