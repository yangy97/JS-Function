/*
 * @version: V1.0.0
 * @Author: 小杨不吃土豆
 * @Date: 2023-03-02 14:41:01
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-03-02 14:41:12
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/study-file/js/promiseAll.js
 * @Descripttion:
 * @Params:
 * @Return:
 */

// 为了测试，实现一个 sleep 函数
const timeAll = (seconds) =>
  new Promise((resolve) => setTimeout(() => resolve(seconds), seconds));

// Promise.all([timeAll(1000), timeAll(2000), timeAll(3000)]).then((res) => {
//   console.log(res);
// });
const PromiseAll = (iteableList) => {
  return new Promise((resolve, reject) => {
    const result = [];
    const iteablelist = Array.from(iteableList);
    const len = iteableList.length;
    let count = 0;
    for (let index = 0; index < len; ++index) {
      Promise.resolve(iteablelist[index])
        .then((o) => {
          result[index] = o;
          console.log(result, "这里打印的值");
          if (++count === len) {
            return resolve(result);
          }
        })
        .catch((e) => {
          reject(e);
        });
    }
    return result;
  });
};

PromiseAll([timeAll(1000), timeAll(2000), timeAll(3000)]).then((res) => {
  console.log(res);
});
