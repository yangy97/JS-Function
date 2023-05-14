/*
 * @version: V1.0.0
 * @Author: 小杨不吃土豆
 * @Date: 2023-04-08 16:14:33
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-04-08 18:39:24
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/study-file/js/parallel.js
 * @Descripttion:
 * @Params:
 * @Return:
 */
function isPromise(p) {
  if (typeof p === "object" && typeof p.then === "function") {
    return true;
  }

  return false;
}

class Parallel {
  constructor(parallelCount) {
    this.parallelCount = parallelCount || 2; //最大并发数量
    this.runningCount = 0; // 正在运行的数量
    this.taskQueue = [];
  }
  add(task) {
    return new Promise((resolve, reject) => {
      //添加任务到任务队列中
      this.taskQueue.push({
        task,
        resolve,
        reject,
      });
      this.runTask();
    });
  }
  runTask() {
    //执行数量小于最大并发并且队列存在任务

    while (this.runningCount < this.parallelCount && this.taskQueue.length) {
      const { task, resolve, reject } = this.taskQueue.shift();
      // this.runningCount++;
      // task()
      //   .then(resolve, reject)
      //   .finally(() => {
      //     this.runningCount--;
      //     this.runTask();
      //   });
      if (isPromise(task())) {
        this.runningCount++;
        task()
          .then(resolve, reject)
          .finally(() => {
            this.runningCount--;
            this.runTask();
          });
      } else {
        throw new Error("task必须是promise");
      }
      if (!this.runningCount && !this.taskQueue.length) {
        break;
      }
    }
  }
}

function timeout(time) {
  return new Promise((resolve) => {
    setInterval(() => {
      resolve();
    }, time);
  });
}

// const superTask = new Parallel();
function Test(maxConcurrency) {
  const ret = []; // 需要返回的队列
  const executing = []; // 运行队列
  this.add = async (task) => {
    const p = Promise.resolve().then(() => task);
    ret.push(p);
    while (maxConcurrency <= ret.length && executing.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      // console.log(e, "打印的东西");
      executing.push(e);
      if (executing.length >= maxConcurrency) {
        await Promise.race(executing);
      }
    }
    return new Promise(()=>{
      
    })

  };
  return Promise.all(ret);
}
const superTask = new Test(2);
function addTask(time, id) {
  superTask
    .add(() => timeout(time))
    .then(() => {
      console.log(`任务${id}完成`);
    });
}

addTask(1000, 1);
addTask(1000, 2);
addTask(1000, 3);
addTask(1000, 4);
addTask(1000, 5);

// function test(maxConcurrency) {
//   const ret = [];
//   const executing = [];
//   this.add = async (task) => {
//     const p = Promise.resolve().then(() => task());
//     ret.push(p);

//     if (maxConcurrency <= source.length) {
//       const e = p.then(() => executing.splice(executing.indexOf(e), 1));
//       executing.push(e);
//       if (executing.length >= maxConcurrency) {
//         await Promise.race(executing);
//       }
//     }
//     return Promise.all(ret);
//   };
// }
