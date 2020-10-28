 /*************************************************************************
 * Copyright (C) 2016-2020 PDX Technologies, Inc. All Rights Reserved. 
 *************************************************************************/
/**
 * 防抖节流
 * @param {*} action 回调
 * @param {*} delay 等待的时间
 * @param {*} context this指针
 * @param {Boolean} iselapsed 是否等待上一次 
 * false,防抖:在第一次触发事件时，不立即执行函数，在一个期限值内，没触发，则执行，再次触发了，那么取消当前事件，重新开始。
 * true:节流：在第一次触发事件以后，不立即执行函数，在一个期限值内，没出发，则执行，再次触发了，直接取消后续操作继续执行当前事件
 * @returns {Function}
 */
export function throttle(action, delay, context, iselapsed) {
  let timeout = null;
  let lastRun = 0;


  return function () {
   
    if (timeout) {
          if (iselapsed) {
              return;
          } else {
              clearTimeout(timeout);
              timeout = null;
          }
      }
      let elapsed = Date.now() - lastRun;
      let args = arguments;
    if (iselapsed && elapsed >= delay) {
     
          runCallback();
    } else {
      
          timeout = setTimeout(runCallback, delay);
      }
      /**
       * 执行回调
       */
      function runCallback() {
          lastRun = Date.now();
          timeout = false;
          action.apply(context, args);
      }
  };
}
export class algorithm {
  constructor(data) {//constructor是一个构造方法，用来接收参数
    this.data = data;//this代表的是实例对象
    this.setGroup = this.resetarr1(data);//重新分类，把属于一行的数据放到一个数据 求交集
    this.sort = this.setSortFromGroup();
    this.sortModule=this.sortModule(data)
  }
  sortModule(data){
    return data
  }
  setSortFromGroup() {
    if (!this.setGroup) {
      this.setGroup = this.resetarr1(data)
    }
    // console.log(this.setGroup);
    // this.setGroup.map(item => this.sort(item, 'top'))
    this.setGroup.map(item =>this.bubbleSort4(item))
    return this.setGroup
  }
  swap(arr, a, b) {//交换位置 //排序的时候用
   [arr[a], arr[b]] = [arr[b], arr[a]]
  }
  sort(arr, requirement) {
    if (typeof requirement == 'string') {
      arr.sort((a, b) => {
        return `a.${requirement}` < `b.${requirement}`
      })
    } else {
      arr.sort((a, b) => {
        return requirement()
      })
    }
    return arr

  }
  bubbleSortTop(arr) {//按照top从小到大排序
    let start = 0;
    let end = arr.length - 1;

    while (start < end) {
      let endPos = 0;
      let startPos = 0;
      // 把紧挨着的小数据放前面，大数据放到后面
      for (let i = start; i < end; i++) {
        if (arr[i].top > arr[i + 1].top) {
          endPos = i;
          this.swap(arr, i, i + 1);//调换位置
        }
      }
      end = endPos;
      for (let i = end; i > start; i--) {
        if (arr[i - 1].top > arr[i].top) {
          startPos = i;
          this.swap(arr, i - 1, i);//调换位置
        }
      }
      start = startPos;
    }

    return arr;
  }
  bubbleSort4(arr) {//按照left排序
    let start = 0;
    let end = arr.length - 1;

    while (start < end) {
      let endPos = 0;
      let startPos = 0;
      //必须做两遍循环让数据大小排序
      // 正序排列

      for (let i = start; i < end; i++) {
        if (arr[i].left > arr[i + 1].left) {//当前元素比下一个大 两个两个比较
          endPos = i;
          this.swap(arr, i, i + 1);
          arr[i].margin_left=arr[i].left-arr[i+1].left
          console.log(arr);
          
        }else{
          arr[i+1].margin_left=arr[i+1].left-arr[i].left
          console.log(arr);
        }

      }
      end = endPos;
      // 倒序排列
      for (let i = end; i > start; i--) {
        if (arr[i - 1].left > arr[i].left) {//当前元素比上一个小，交换
          startPos = i;
          arr[i-1].margin_left=arr[i-1].left-arr[i].left
          this.swap(arr, i - 1, i);
        }else{
          arr[i].margin_left=arr[i].left-arr[i-1].left
        }
      }

      start = startPos;
    }
  

    // for(let i=0;i<arr.length;i++){
    //   let item = arr[i]
    //   let preItem=i==0?[]:arr[i-1]
    //   // 获取上一个最大高度的元素
    //   let maxPreItem=preItem.reduce((total,cur,index)=>{
    //     return total.height+total.top<cur.top+cur.height?cur:total
    //   },{height:0,top:0,left:0,width:0})
    //   // console.log(maxPreItem.height,maxPreItem.top,i);
    //   for(let j=0;j<item.length;j++){
    //     // 当前元素的top值-最大高度的height
    //     item[j].margintop=item[j].top-maxPreItem.height-maxPreItem.top;
    //    //每一行的元素右边减去左边的宽度+left
    //     if(j>0){
    //        item[j].marginleft=item[j].left-item[j-1].width-item[j-1].left
    //     }else{
    //       item[j].marginleft=item[j].left
    //     }
    //   }
    // }

    return arr;
  }
  aaa(arr) {//按照left排序
    let start = 0;
    let end = arr.length - 1;
    while (start < end) {
      let endPos = 0;
      let startPos = 0;
      //必须做两遍循环让数据大小排序
      // 正序排列
      for (let i = start; i < end; i++) {
        if (arr[i] > arr[i + 1]) {//当前元素比下一个大 两个两个比较
          endPos = i;
          this.swap(arr, i, i + 1);
        }
      }
      end = endPos;
      // 倒序排列
      for (let i = end; i > start; i--) {
        if (arr[i - 1] > arr[i]) {//当前元素比上一个小，交换
          startPos = i;
          this.swap(arr, i - 1, i);
        }
      }
  
      start = startPos;
    }
  


    return arr;
  }
  // let a=new Set([1,2,3]);
  // let b=new Set([2,3,4]);


  // //并集
  // let union=new Set([...a,...b]);
  // console.log(union);

  // //交集
  // let intersect=new Set([...a].filter(x=>b.has(x)));
  // console.log(intersect);

  // //差集
  // let diff=new Set([...a].filter(x=>!b.has(x)));
  resetarr1(arr) {//重新分类，把属于一行的数据放到一个数据 求交集
    arr = this.bubbleSortTop(arr)
    let resetarr_ = [];
    let newArr = [].concat(arr);
    let start = 0,
      end = arr.length;
    while (start < end) {
      let key = 0,
        d = newArr[0],
        dth = newArr[0].height + newArr[0].top,//第一个范围值 
        dt = newArr[0].top;
        
      let newaa = [d]
      newArr.splice(0, 1)
      for (let i = 0; i < newArr.length; i++) {//循环归类一次

        let aitem = newArr[i];
        let aiT = aitem.top, aiH = aitem.height, aiTH = aitem.top + aitem.height
        // 当前组件top 
        if ((aiT >= dt && aiT <= (dth - 5)) || (aiT <= dt && aiTH > dt)) {//当前元素和被比较元素有重合的地方  组件的上面在范围内， 组件的下面在范围内（范围表示被比较的组件）
          newaa.push(aitem)
          newArr.splice(i, 1)
          start++;//需要少遍历一次
        }

      };
      start++;
      resetarr_.push(newaa);

    }

    return resetarr_


  }
}
// export const algorithm