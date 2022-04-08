var path = require("path");
var fs = require("fs");
let resolve = function(dir) {
    return path.resolve(dir);
}

function MyExampleWebpackPlugin() {}
//文件遍历方法
function fileDisplay(filePath) {
    //根据文件路径读取文件，返回文件列表
    let files = fs.readdirSync(filePath);
    //遍历读取到的文件列表
    files.forEach(function(filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        console.log(filedir,'+++++', filename)
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        let stats= fs.statSync(filedir);
        var isFile = stats.isFile(); //是文件
        if (isFile && /\.html$/.test(filedir)) {
            var files = fs.readFileSync(filedir, 'utf-8');
            files = files.replace(/\/h5/g, "");
            files = files.replace(/<link rel="?stylesheet"? href="?\/static\/index\.(.+?)\.css"?>/, '<link rel=stylesheet href=/static/dist/shop_wap/index.$1.css>');
            fs.writeFileSync(filedir, files);
        }
    });
}


function deleteall(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse
                deleteall(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
MyExampleWebpackPlugin.prototype.apply = function(compiler) {
    compiler.hooks.afterEmit.tap('afterEmit', function() {
        var dirs = []
        let pathName = resolve('./dist/build/h5/static')
        let dscName = resolve('./dist/build/h5/static/dist/shop_wap/')

        try {
              let files = fs.readdirSync(pathName);
              for (var i = 0; i < files.length; i++) {
                if (files[i].lastIndexOf(".css") > -1) {
                  fs.copyFileSync(
                    path.join(pathName, files[i]),
                    path.join(dscName, files[i])
                  );
                  fileDisplay(resolve("./dist/build/h5"));
                }
              }
              // deleteall(resolve('./dist/build/h5/static'));


              let fsDir = path.join(dscName, "static/js/");
              let fsFiles = fs.readdirSync(fsDir);
              
              fsFiles.forEach(item => {
                  const F = path.join(fsDir, item);

                  let stats = fs.statSync(F);
                  var isFile = stats.isFile();

                  if (isFile && /\.js$/.test(F)) {
                    //   console.log(F, "mmmmmmmm----->>>")
                      
                      let files = fs.readFileSync(F, "utf-8");

                      files = files.replace(/s\.p=.*?\,/, "s.p='/',");

                      fs.writeFileSync(F, files);
                  }


                //   console.log(F, "@@@@@@@@@@@@@@@@@@@@@@@@@@")
              });
            
            
            } catch (err) {
            console.log('error>>>', err)
        }

    });
};
module.exports = MyExampleWebpackPlugin;