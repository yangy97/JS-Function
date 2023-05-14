/*
 * @version: V1.0.0
 * @Author: 小杨不吃土豆
 * @Date: 2023-03-02 14:41:01
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-03-02 15:18:00
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/study-file/js/promiseRace.js
 * @Descripttion:
 * @Params:
 * @Return:
 */
// 为了测试，实现一个 sleep 函数
const timeAll = (seconds) => {
  if (seconds === 2000) {
    return new Promise((_, reject) => {
      setTimeout(() => reject(seconds), seconds);
    }).catch((e) => {
      console.log(e, "打印的错误");
    });
  }
  return new Promise((resolve) => {
    setTimeout(() => resolve(seconds), seconds);
  });
};

// Promise.all([timeAll(1000), timeAll(2000), timeAll(3000)]).then((res) => {
//   console.log(res);
// });
const PromiseRace = (iteableList) => {
  return new Promise((resolve, reject) => {
    for (let index = 0; index < iteableList.length; ++index) {
      Promise.resolve(iteableList[index])
        .then((o) => {
          resolve(o);
        })
        .catch((e) => {
          reject(e);
        });
    }
  });
};

PromiseRace([timeAll(1000), timeAll(2000), timeAll(3000)]).then((res) => {
  console.log(res);
});
