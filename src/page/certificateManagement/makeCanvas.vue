<template>
  <div id="inCanvas"></div>
</template>

<script>
//  二维码插件  https://www.npmjs.com/package/qrcode
import QRCode from "qrcode";
export default {
  props: ["muban"],
  data() {
    return {
      fangdou: null,
    };
  },
  watch: {
    muban: {
      handler: function (t) {
        if (!this.fangdou) {
          // 防抖
          this.fangdou = setTimeout(async () => {
            let kk = await this.makeCanvas(t);
            document.getElementById("inCanvas").appendChild(kk);
          }, 1000);
        } else {
          clearTimeout(this.fangdou);
          this.fangdou = null;
        }
      },
      deep: true,
    },
  },
  methods: {
    // 生成最终使用的canva数据
    async returnData(er) {
      let qrcodeData = this.muban.children.filter(
        (t) => t.tagName === "qrcode"
      )[0];
      qrcodeData.content = er;
      let kk = await this.makeCanvas(this.muban);
      return kk.toDataURL("image/png", 1); // 将canvas转成base64码
    },
    // 生成二维码
    makeEr(qrcodeData) {
      // 要生成二维码的数据
      let erWeiMa = qrcodeData.content;
      var opts = {
        errorCorrectionLevel: "Q",
        quality: 1,
        margin: 0.2,
        maskPattern: 7, // 用于遮罩符号的遮罩图案  0--7
        width: 72,
        color: {
          dark: "#000",
          light: "#fff",
        },
      };
      // 生成二维码，是一个base64 字符串
      return QRCode.toDataURL(erWeiMa, opts).then(async (data) => {
        // 生成的是一个base64 字符串
        let img = new Image();
        img.src = data;
        await new Promise((res) => {
          image.onload = () => {
            res({
              data: img,
              width: opts.width,
            });
          };
        });
      });
    },
    async makeCanvas(forCanvas) {
      // 构建canvas
      let canvas = document.createElement("canvas"),
        context = canvas.getContext("2d");

      canvas.width = forCanvas.width;
      canvas.height = forCanvas.height;
      // 画背景颜色
      if (forCanvas.backgroundColor) {
        context.save();
        context.fillStyle = forCanvas.backgroundColor;
        context.fillRect(0, 0, forCanvas.width, forCanvas.height);
        context.restore();
      }
      // 画背景图片
      if (forCanvas.backgroundImage) {
        context.save();
        var image = new Image();
        image.src = forCanvas.backgroundImage;
        await new Promise((res) => {
          image.onload = () => {
            context.drawImage(image, 0, 0, forCanvas.width, forCanvas.height);
            res();
          };
        });
        context.restore();
      }

      // 画各个内容
      forCanvas.children.forEach(async (t) => {
        // 画图片
        if (t.tagName === "presetImg") {
          context.save();
          await new Promise((res) => {
            let image = new Image();
            image.src = t.content;
            image.onload = (e) => {
              context.drawImage(e.path[0], t.left, t.top, t.width, t.height);
              res();
            };
          });
          context.restore();
        }
        if (t.tagName === "qrcode") {
          // 画二维码
          context.save();

          // 要生成二维码的数据

          var opts = {
            errorCorrectionLevel: "Q",
            quality: 1,
            margin: 0.2,
            maskPattern: 7, // 用于遮罩符号的遮罩图案  0--7
            width: 72,
            color: {
              dark: "#000",
              light: "#fff",
            },
          };
          // 生成二维码，是一个base64 字符串
          let ma = await QRCode.toDataURL(t.content, opts);
          await new Promise((res) => {
            // 生成的是一个base64 字符串
            let image = new Image();
            image.src = ma;
            image.onload = (e) => {
              let erWeiMaX = forCanvas.width - opts.width;
              let erWeiMaY = forCanvas.height - opts.width;

              context.drawImage(
                e.path[0],
                erWeiMaX,
                erWeiMaY,
                opts.width,
                opts.width
              );
              context.restore();
              res();
            };
          });
        }
        // 画文字
        if (t.tagName === "presetText") {
          let spans = document.getElementById("chicun"),
            textArr = t.content.text.split("");
          if (!spans) {
            spans = document.createElement("span");
            spans.id = "chicun";
            spans.style = "position: fixed; opacity: 0";
            document.body.appendChild(spans);
          }
          context.save();
          context.fillStyle = t.content.css.fillStyle; // 文字颜色
          context.font = t.content.css.font; // 文字样式
          context.textBaseline = "top"; // 文字起笔点
          // 还原字体的分行显示
          let arr = [], // 保存最后拆行的文字
            num = 0, // 记录字符宽度累计
            lastType = "", // 记录上一个文字的类型
            str = ""; // 记录目前累计的文字
          // 将文字拆成数组，逐个查看宽度
          textArr.forEach((d, ind) => {
            let tk = d.charCodeAt(),
              nowType = "";
            // 判断文字类型，方便后边的对比
            if (tk >= 48 && tk <= 57) {
              //"数字";
              nowType = 1;
            } else if (tk >= 65 && tk <= 90) {
              // "大写";
              nowType = 2;
            } else if (tk >= 97 && tk <= 122) {
              // "小写";
              nowType = 3;
            } else if (tk > 122) {
              // "中文";
              nowType = 4;
            } else {
              //  "标点";
              nowType = 5;
            }
            let w = spans.offsetWidth; // 获取当前span的宽度
            // 如果文字类型发生变动，需要重新获取span宽度
            if (lastType !== nowType) {
              lastType = nowType;
              spans.innerHTML = d;
              w = spans.offsetWidth;
              setArr();
            } else {
              setArr();
            }
            // 设置分组函数
            function setArr() {
              if (num + w > t.width) {
                arr.push(str);
                str = d;
                num = w;
              } else {
                str += d;
                num += w;
              }
            }
            // 收尾
            if (ind === textArr.length - 1) {
              arr.push(str);
            }
          });
          //   绘制字体
          arr.forEach((str, index) => {
            let top = index === 0 ? t.top + 4 : t.top;
            context.fillText(str, t.left, top + index * spans.offsetHeight);
          });
          context.restore();
        }
      });
      return canvas;
    },
  },
};
</script>

<style scoped>
#inCanvas {
  display: flex;
  justify-content: center;
}
</style>
