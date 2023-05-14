/*
 * @version: V1.0.0
 * @Author: 小杨不吃土豆
 * @Date: 2023-02-08 16:15:24
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-02-08 16:30:31
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/study-file/js/instanceof.js
 * @Descripttion: 
 * @Params: 
 * @Return: 
 */


function _instanceof(left,right){
  if( left === null||typeof left !== 'object' ) return false;
    var _rightProto = right.prototype;
    left = left.__proto__;
  while(true){
    // 左边找不到的情况下 也就是找到最顶层null 
    if (left === null){
          return false
    }
    if(_rightProto===left){
      return true
    }
    left = left.__proto__
  }
}
// console.log(_instanceof([],'Object'))
// console.log([].__proto__.__proto__)