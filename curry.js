/*
 * @version: V1.0.0
 * @Author: 小杨不吃土豆
 * @Date: 2023-02-07 15:38:30
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-04-26 00:07:00
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/study-file/js/curry.js
 * @Descripttion:
 * @Params:
 * @Return:
 */

/**
 * @Description  函数柯力化 简易求和版 curry()(1,2,3)(4)
 * @Author: 杨玉印
 * @param { 函数初始化值 利用必包 返回一个函数}
 * @return {利用必包 返回一个函数}
 */
function curry(...rest) {
  // rest 接受第一次获取的参数
  function innerCurry() {
    console.log(rest, "push前");
    // 合并 后续参数 比如 curry(1,2)(3) ->[1,2,3]
    rest.push(...arguments);
    console.log(rest, "push后");
    // 利用必包 返回当前函数
    return innerCurry;
  }
  // 隐式转换 修改本身toString方法 进而求和
  innerCurry.toString = () => rest.reduce((x, y) => x + y);
  return innerCurry;
}
console.log(curry()); //[Function: innerCurry] { toString: [Function (anonymous)] }111
console.log(curry()(3).toString()); // 6

/*
 * @version: V1.0.1
 * @Author: 小杨不吃土豆
 * @Date: 2023-02-07 15:38:30
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-04-07 22:41:05
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/study-file/js/curry.js
 * @Descripttion:
 * @Params:
 * @Return:
 */

/**
 * @Description  函数柯力化 简易版
 * @Author: 杨玉印
 * @param { 函数初始化值 利用必包 返回一个函数}
 * @return {利用必包 返回一个函数}
 */
function curry1(fn, ...existingArgs) {
  // rest 接受第一次获取的参数
  // function innerCurry() {
  //   console.log(rest, 'push前')
  //   // 合并 后续参数 比如 curry(1,2)(3) ->[1,2,3]
  //   rest.push(...arguments)
  //   console.log(rest, 'push后')
  //   // 利用必包 返回当前函数
  //   return innerCurry
  // }
  // // 隐式转换 修改本身toString方法 进而求和
  // innerCurry.toString = (() => rest.reduce((x, y) => x + y))
  // return innerCurry
  return function () {
    // 拼接存储已经获取到的变量
    let _args = [...existingArgs, ...arguments];
    console.log(existingArgs, arguments, "这里打印的参数");
    // console.log("拼接后的 _args:",_args)

    // 与原函数所需的参数个数进行比较
    if (_args.length < fn.length) {
      // 参数个数还不够，递归，继续返回函数
      return curry(fn, ..._args);
    } else {
      return fn.apply(this, _args);
    }
  };
}
const aa = (a, b, c, d, e) => {
  return [a, b, c, d, e];
};
console.log(curry1(aa, 1, 2, 3, 4)(5)); //[Function: innerCurry] { toString: [Function (anonymous)] }111
// console.log(curry()(3).toString()); // 6
function add(...args) {
  //求和
  return args.reduce((a, b) => a + b);
}
function currying(fn) {
  let args = [];
  return function temp(...newArgs) {
    if (newArgs.length) {
      args = [...args, ...newArgs];
      return temp;
    } else {
      let val = fn.apply(this, args);
      args = []; //保证再次调用时清空

      return val;
    }
  };
}
function add(...arg) {
  return arg.reduce((p, c) => p + c);
}
let addCurry = currying(add);
console.log(addCurry(1)(2)(3)(4, 5)());

function add(...arg1) {
  let adder = function (...arg2) {
    arg1 = [...arg1, ...arg2];
    console.log(arg1, arg2, "打印");
    if (!arg2.length) {
      return arg1.reduce((a, b) => a + b);
    } else {
      return adder;
    }
  };
  // console.log(arg1, "打印1");
  // adder.valueof = () => {
  //   console.log(arg1, "求和");
  //   return arg1.reduce((a, b) => a + b);
  // };
  return adder;
}
console.log(add(1, 2)(3)(4)());
