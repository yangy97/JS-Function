const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";
class MyPromise {
  #state = PENDING;
  #result = undefined;
  #handler = [];
  constructor(executor) {
    const resolve = (data) => {
      this.#changeState(FULFILLED, data);
    };
    const reject = (reason) => {
      this.#changeState(REJECTED, reason);
    };
    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  #isPromise(value) {
    if (
      value !== null &&
      (typeof value === "object" || typeof value === "function")
    ) {
      return typeof value.then === "function";
    }
    return false;
  }
  #changeState(state, result) {
    //当状态改变后 不再继续执行
    if (this.#state !== PENDING) return;
    //修改当前状态
    this.#state = state;
    // 修改当前结果 成功或者失败
    this.#result = result;
    this.#run();
  }

  #run() {
    if (this.#state === PENDING) return;
    while (this.#handler.length) {
      let { onFulfilled, onRejected, resolve, reject } = this.#handler.shift();
     
      if (this.#state === FULFILLED) {
        this.#runOne(onFulfilled, resolve, reject);
      } else {
        this.#runOne(onRejected, resolve, reject);
      }
    }
  }
  #runOne(callback, resolve, reject) {
    this.#runMicroTask(() => {
       // 执行resolve, reject 的时机
      // 1 不是函数
     
      if (typeof callback !== "function") {
        const settle = this.#state === FULFILLED ? resolve : reject;
        settle(this.#result);
        return;
      }
      try {
         // 2.返回了promise
        const data = callback(this.#result);

        if (this.#isPromise(data)) {
          data.then(resolve, reject);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  #runMicroTask(func) {
    // node.js
    if (typeof process === "object" && typeof process.nextTick === "function") {
      process.nextTick(func);
    }
    //browser
    else if (typeof MutationObserver === "function") {
      const ob = new MutationObserver(func);
      const textNode = document.createTextNode("1");
      ob.observe(textNode, { characterData: true });
      textNode.data = "2";
    } else {
      setTimeout(func, 0);
    }
  }
  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      this.#handler.push({
        onFulfilled,
        onRejected,
        resolve,
        reject,
      });
      this.#run();
    });
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  static resolve(value) {
    if (value instanceof MyPromise) return value;
    let _resolved, _rejected;
    const p = new MyPromise((resolve) => {
      _resolved = resolve;
      _rejected = reject;
    });
    if (p.#isPromise(value)) {
      value.then(_resolved, _rejected);
    } else {
      _resolved(value);
    }
    return p;
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  finally(onFinally) {
    return this.then(
      (data) => {
        onFinally();
        return data;
      },
      (err) => {
        onFinally();
        throw err;
      }
    );
  }
}

// setTimeout(() => {
//   console.log(1);
// }, 1000);
// new MyPromise((res, rej) => {
//   res(2);
// }).then((res) => {
//   console.log(res);
// });
// console.log(3);

// export default MyPromise;
// const p1 = new MyPromise((res, rej) => {
//   res(1);
//   // rej(1);
// });

// console.log(MyPromise.resolve(p1)===p1);
