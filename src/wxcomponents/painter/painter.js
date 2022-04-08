/**
 * 开店星新零售管理系统
 * @description 基于Yii2+Vue2.0+uniapp研发，H5+小程序+公众号全渠道覆盖，功能完善开箱即用，框架成熟易扩展二开
 * @author 青岛开店星信息技术有限公司
 * @link https://www.kaidianxing.com
 * @copyright Copyright (c) 2020-2022 Qingdao ShopStar Information Technology Co., Ltd.
 * @copyright 版权归青岛开店星信息技术有限公司所有
 * @warning Unauthorized deletion of copyright information is prohibited.
 * @warning 未经许可禁止私自删除版权信息
 */
const Pen = require('./lib/pen')
const Downloader = require('./lib/downloader');
const util = require('./lib/util');

const downloader = new Downloader();

// 最大尝试的绘制次数
const MAX_PAINT_COUNT = 5;
Component({
  canvasWidthInPx: 0,
  canvasHeightInPx: 0,
  paintCount: 0,
  failcount : 0,
  /**
   * 组件的属性列表
   */
  properties: {
    customStyle: {
      type: String,
    },
    palette: {
      type: Object,
      observer: function (newVal, oldVal) {
        if (this.isNeedRefresh(newVal, oldVal)) {
          this.paintCount = 0;
          this.startPaint();
        }
      },
    },
    widthPixels: {
      type: Number,
      value: 0
    },
    // 启用脏检查，默认 false
    dirty: {
      type: Boolean,
      value: false,
    },
  },

  data: {
    picURL: '',
    showCanvas: true,
    painterStyle: '',
  },

  methods: {
    /**
     * 判断一个 object 是否为 空
     * @param {object} object
     */
    isEmpty(object) {
      for (const i in object) {
        return false;
      }
      return true;
    },

    isNeedRefresh(newVal, oldVal) {
      if (!newVal || this.isEmpty(newVal) || (this.data.dirty && util.equal(newVal, oldVal))) {
        return false;
      }
      return true;
    },

    startPaint() {
      if (this.isEmpty(this.properties.palette)) {
        return;
      }

      if (!(getApp().systemInfo && getApp().systemInfo.screenWidth)) {
        try {
          getApp().systemInfo = wx.getSystemInfoSync();
        } catch (e) {
          const error = `Painter get system info failed, ${JSON.stringify(e)}`;
          that.triggerEvent('imgErr', {
            error: error
          });
          console.error(error);
          return;
        }
      }
      let screenK = getApp().systemInfo.screenWidth / 750;
      setStringPrototype(screenK, 1);
      
      this.downloadImages().then((palette) => {
        const {
          width,
          height
        } = palette;
        
        if (!width || !height) {
          console.error(`You should set width and height correctly for painter, width: ${width}, height: ${height}`);
          return;
        }
        this.canvasWidthInPx = width.toPx();
        if (this.properties.widthPixels) {
          // 如果重新设置过像素宽度，则重新设置比例
          setStringPrototype(screenK, this.properties.widthPixels / this.canvasWidthInPx)
          this.canvasWidthInPx = this.properties.widthPixels
        }
  
        this.canvasHeightInPx = height.toPx();
        this.setData({
          painterStyle: `width:${this.canvasWidthInPx}px;height:${this.canvasHeightInPx}px;`,
        });
        const ctx = wx.createCanvasContext('k-canvas', this);
        const pen = new Pen(ctx, palette);
        pen.paint(() => {
          this.saveImgToLocal();
        });
      });
    },

    downloadImages() {
      return new Promise((resolve, reject) => {
        let preCount = 0;
        let completeCount = 0;
        const paletteCopy = JSON.parse(JSON.stringify(this.properties.palette));
        if (paletteCopy.background) {
          preCount++;
          downloader.download(paletteCopy.background).then((path) => {
            paletteCopy.background = path;
            completeCount++;
            if (preCount === completeCount) {
              resolve(paletteCopy);
            }
          }, () => {
            completeCount++;
            if (preCount === completeCount) {
              resolve(paletteCopy);
            }
          });
        }
        if (paletteCopy.views) {
          for (const view of paletteCopy.views) {
            if (view && view.type === 'image' && view.url) {
              preCount++;
              /* eslint-disable no-loop-func */
              downloader.download(view.url).then((path) => {
                view.url = path;
                wx.getImageInfo({
                  src: view.url,
                  success: (res) => {
                    // 获得一下图片信息，供后续裁减使用
                    view.sWidth = res.width;
                    view.sHeight = res.height;
                  },
                  fail: (error) => {
                    // 如果图片坏了，则直接置空，防止坑爹的 canvas 画崩溃了
                    view.url = "";
                    console.error(`getImageInfo ${view.url} failed, ${JSON.stringify(error)}`);
                  },
                  complete: () => {
                    completeCount++;
                    if (preCount === completeCount) {
                      resolve(paletteCopy);
                    }
                  },
                });
              }, () => {
                completeCount++;
                if (preCount === completeCount) {
                  resolve(paletteCopy);
                }
              });
            }
          }
        }
        if (preCount === 0) {
          resolve(paletteCopy);
        }
      });
    },

    saveImgToLocal() {
      const that = this;
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'k-canvas',
          fileType:'jpg',
          destWidth: that.canvasWidthInPx,
          destHeight: that.canvasHeightInPx,
          success: function (res) {
            that.getImageInfo(res.tempFilePath);
          },
          fail: function (error) {
            that.failcount=that.failcount||0
            if(that.failcount<3){
              that.failcount=that.failcount+1
              that.saveImgToLocal()
              console.error(error,':::::',that.failcount)
            }else{
              console.error(`canvasToTempFilePath failed wx1, ${JSON.stringify(error)}`);
              that.triggerEvent('imgErr', {
                error: error
              });
              that.failcount=0
            }
          },
        }, this);
      }, 300);
    },

    getImageInfo(filePath) {
      const that = this;
      wx.getImageInfo({
        src: filePath,
        success: (infoRes) => {
          if (that.paintCount > MAX_PAINT_COUNT) {
            const error = `The result is always fault, even we tried ${MAX_PAINT_COUNT} times`;
            console.error(error);
            that.triggerEvent('imgErr', {
              error: error
            });
            return;
          }
          // 比例相符时才证明绘制成功，否则进行强制重绘制
          if (Math.abs((infoRes.width * that.canvasHeightInPx - that.canvasWidthInPx * infoRes.height) / (infoRes.height * that.canvasHeightInPx)) < 0.01) {
            that.triggerEvent('imgOK', {
              path: filePath
            });
          } else {
            that.startPaint();
          }
          that.paintCount++;
        },
        fail: (error) => {
          console.error(`getImageInfo failed, ${JSON.stringify(error)}`);
          that.triggerEvent('imgErr', {
            error: error
          });
        },
      });
    },
  },
});


function setStringPrototype(screenK, scale) {
  /* eslint-disable no-extend-native */
  /**
   * 是否支持负数
   * @param {Boolean} minus 是否支持负数
   */
  String.prototype.toPx = function toPx(minus) {
    let reg;
    if (minus) {
      reg = /^-?[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g;
    } else {
      reg = /^[0-9]+([.]{1}[0-9]+){0,1}(rpx|px)$/g;
    }
    const results = reg.exec(this);
    if (!this || !results) {
      console.error(`The size: ${this} is illegal`);
      return 0;
    }
    const unit = results[2];
    const value = parseFloat(this);

    let res = 0;
    if (unit === 'rpx') {
      res = Math.round(value * screenK * (scale || 1));
    } else if (unit === 'px') {
      res = Math.round(value * (scale || 1));
    }
    return res;
  };
}