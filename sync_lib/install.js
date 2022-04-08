/*
 * @Description: 安装所有修改第三方库的内容
 * @Autor: 青岛开店星信息技术有限公司
 */

const ignore = ["README.md", "install.js"];

const path = require("path");

// 系统资源具柄
const fs = require("fs");

// 处理路径
let resolve = function(dir) {
  return path.resolve(dir);
};

// 获取安装资源目录
function getInstallDirs() {
  const Res = [];

  // 获取相对路径
  const RELATIVE = __dirname;
  fs.readdirSync(RELATIVE).forEach((item) => {
    if (!ignore.includes(item)) {
      const TOPATH = item.split("_").join("/");
      const FROMPATH = item;

      Res.push({
        fromBase: path.join(__dirname, FROMPATH),
        toBase: path.join(__dirname, "../node_modules", TOPATH),
      });
    }
  });

  return Res;
}

// 检测
function isFile(F) {
  let stats = fs.statSync(F);
  let isFile = stats.isFile();
  return isFile;
}

// 执行复制操作
function copy(DIRS = []) {
  DIRS.forEach((item) => {
    fs.readdirSync(item.fromBase).forEach((i) => {
      const TOFILENAME = item.toBase + "/" + i;
      const FRAMEFILENAME = item.fromBase + "/" + i;

      console.log("to:", TOFILENAME, "from:", FRAMEFILENAME);

      if (isFile(FRAMEFILENAME)) {
        fs.copyFileSync(FRAMEFILENAME, TOFILENAME);
      }
    });
  });
}

// 安装
function main() {
  console.log("开始安装......");

  // 获取安装目录
  const DIRS = getInstallDirs();
  // copy
  copy(DIRS);

  console.log("安装结束......");
}

main();
