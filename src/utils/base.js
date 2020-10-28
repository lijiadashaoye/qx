/*************************************************************************
 * Copyright (C) 2016-2019 The PDX Blockchain Hypercloud Authors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *************************************************************************/
// if(!Uint8Array.prototype.slice){
//     Uint8Array.prototype.slice = function(){
//         return new Uint8Array(this).subarray(this.arguments);
//     }
// };
// import protobuf  from "protobufjs";
// import  Tx from 'ethereumjs-tx'

export const base = function install(Vue, options) {
  Vue.prototype.buffer = function (jsonData, type, num) {
    var protobuf = require("protobufjs");
    var proto = "syntax=\"proto3\";\
                    message Transaction {\
                        uint32 type = 1;\
                        bytes payload = 2;\
                    }\
                    message Invocation {\
                        string fcn = 1;\
                        repeated bytes args = 2;\
                        map<string, bytes> meta = 3;\
                     }\
                    message KeyItem {\
                        string key = 1;\
                        bytes value = 2;\
                        string desc = 3;\
                        repeated bytes Uauth = 4;\
                        repeated bytes Dauth = 5;\
                        string dname = 6;\
                        uint64 version = 7;\
                    }";
    var root = protobuf.parse(proto, {
      keepCase: true
    }).root; // or use Root#load
    var pcChain = root.lookup(type);
    var message = pcChain.create(jsonData);
    var buffer = pcChain.encode(message).finish();
    if (num === 1) {
      return buffer;
    } else {
      return message;
    }
  }
  Vue.prototype.downloadFile = function (data, fileName) {
    if (!data) {
      return
    }

    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click();
    link.remove();
  };
  Vue.prototype.ut8Str = function (arr) {
    var str = "";
    arr = Array.from(arr);
    for (var i = 0; i < arr.length; i++) {
      var tmp = arr[i].toString(16);
      if (tmp.length == 1) {
        tmp = "0" + tmp;
      }
      str += tmp;
    }
    return str;
  }
  Vue.prototype.intByt = function (i) {
    var targets = [];
    targets[0] = (i & 0xFF);
    return targets;
  }
  Vue.prototype.eth_getParems = function (rawTx, privateK) {
    var Tx = require('ethereumjs-tx');
    var privateKey = new Buffer(privateK, 'hex');
    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    return serializedTx.toString('hex');
  }
  Vue.prototype.mainChainCoin = function (value) {
    if (!value || value == "0x") {
      return "0"
    }
    var res = Number(value) / (Math.pow(10, 9));
    return res.toFixed(6);
  }
  Vue.prototype.wallet = function () {
      var ethers = require('ethers');
      var walletInfo = ethers.Wallet.createRandom();
      return walletInfo;
    },
    Vue.prototype.checkPubKey = function (privateK) {
      var ethers = require('ethers');

      if (privateK.substr(0, 2) != "0x") {
        privateK = "0x" + privateK;
      }
      try {
        var wallet = new ethers.Wallet(privateK);
        console.log(wallet);
      } catch (err) {
        return;
      }
      var wallet = new ethers.Wallet(privateK);
      return wallet.signingKey.keyPair.compressedPublicKey;
    }
  Vue.prototype.checkAddress = function (privateK) {
    var ethers = require('ethers');

    if (privateK.substr(0, 2) != "0x") {
      privateK = "0x" + privateK;
    }
    try {
      var wallet = new ethers.Wallet(privateK);
    } catch (err) {
      return;
    }
    var wallet = new ethers.Wallet(privateK);
    return wallet.address.toLowerCase();
  }
  Vue.prototype.tostringToUint8Array = function stringToUint8Array(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
      arr.push(str.charCodeAt(i));
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array
  }
  Vue.prototype.toByte = function stringToByte(str) {
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0);
        bytes.push(((c >> 12) & 0x3F) | 0x80);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0);
        bytes.push((c & 0x3F) | 0x80);
      } else {
        bytes.push(c & 0xFF);
      }
    }
    return bytes;
  }
  //16进制转换byte (对负值填坑)
  Vue.prototype.toByte2 = function stringToByte(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
      return null;
    }
    len /= 2;
    var arrBytes = new Array();
    for (var i = 0; i < len; i++) {
      var s = str.substr(pos, 2);
      var v = parseInt(s, 16);
      arrBytes.push(v);
      pos += 2;
    }
    return arrBytes;
  }
  Vue.prototype.delete = function (params) {
    if (params != null && params.length > 0) {
      return params.replace(/(^\s*)|(\s*$)/g, "");
    } else {
      return params
    }
  }
  Vue.prototype.buf2hex = function (buffer) { // buffer is an ArrayBuffer
    // create a byte array (Uint8Array) that we can use to read the array buffer
    const byteArray = new Uint8Array(buffer);

    // for each element, we want to get its two-digit hexadecimal representation
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i++) {
      // convert value to hexadecimal
      const hex = byteArray[i].toString(16);

      // pad with zeros to length 2
      const paddedHex = ('00' + hex).slice(-2);

      // push to array
      hexParts.push(paddedHex);
    }

    // join all the hex values of the elements into a single string
    return hexParts.join('');
  }
  Vue.prototype.base64Urlencode = function (str) {
    var base64 = str;

  }
  Vue.prototype.$UNFile = function (data, fileName) {
    if (!data) {
      return
    }
    let files = new window.File([data], fileName, {
      type: 'zip'
    })
    // 读取zip压缩文件里面的文件内容
    let JSZip = require('jszip');
    JSZip.loadAsync(files).then((zip) => {
      for (let key in zip.files) {
        console.log(key);
        if (key.indexOf('.xlsx') !== -1) {
          let base = zip.file(zip.files[key].name).async('blob')
          base.then(res => {
            let fileCrt = new window.File([res], {
              type: 'xlsx'
            });
            let XLSX = require('xlsx');
            if (fileCrt.length <= 0) { //如果没有文件名
              return false;
            } else if (!/\.(xls|xlsx)$/.test(fileCrt[0].name.toLowerCase())) {
              return false;
            }
            let outputs = [];
            const fileReader = new FileReader();
            fileReader.onload = (ev) => {
              try {
                const data = ev.target.result;
                const workbook = XLSX.read(data, {
                  type: 'binary'
                });
                const wsname = workbook.SheetNames[0]; //取第一张表
                const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); //生成json表格内容
                console.log(ws);
                outputs = []; //清空接收数据
                //编辑数据
                for (var i = 0; i < ws.length; i++) {
                  var sheetData = {
                    address: ws[i].addr,
                    value: ws[i].value
                  }
                  outputs.push(sheetData);
                }
              } catch (e) {
                return false;
              }
            };
            fileReader.readAsBinaryString(files[0]);
          })
        }
      }
    })
  };
  // 二维码签名
  Vue.prototype.cordSign = function (data, privateKeyStr) {
    const sha3 = require('js-sha3');
    const util = require('ethereumjs-util');
    const Base64Url = require('base64url');
    const sha3Message = sha3.keccak256(data);
    if (privateKeyStr.substr(0, 2) != "0x") {
      privateKeyStr = privateKeyStr;
    } else {
      privateKeyStr = privateKeyStr.slice(2)
    }
    const binaryData = new Buffer(sha3Message, 'hex');
    const privateKey = new Buffer(privateKeyStr, 'hex');
    let privateKey2 = new Buffer(32);
    for (let i = 0; i < privateKey2.length; i++) {
      privateKey2[i] = privateKey[i];
    }
    let sigPromise = util.ecsign(binaryData, privateKey2);
    let byteArr = new Buffer(65);
    byteArr[0] = sigPromise.v;
    let r = sigPromise.r;
    for (var i = 1; i < 33; i++) {
      byteArr[i] = r[i - 1];
    }
    let s = sigPromise.s;
    for (var i = 33; i < 66; i++) {
      byteArr[i] = s[i - 33];
    }
    return Base64Url(byteArr);
  }
};
