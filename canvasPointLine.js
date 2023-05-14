/*
 * @version: V1.0.0
 * @Author: 小杨不吃土豆
 * @Date: 2023-03-09 16:04:57
 * @LastEditors: 小杨不吃土豆
 * @LastEditTime: 2023-03-09 17:54:01
 * @company: xxx
 * @Mailbox: y1597355434@gamil.com
 * @FilePath: /www/test/js/canvas.js
 * @Descripttion:
 * @Params:
 * @Return:
 */
const cvs = document.querySelector("canvas");
const ctx = cvs.getContext("2d");
// 初始化cancvs 宽高
function init() {
  cvs.width = window.innerWidth;
  cvs.height = window.innerHeight;
}
init();
/**
 * @Description 随机函数
 * @Author: 杨玉印
 * @param {min:最小 ,mam:最大}
 * @return {}
 */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function getRandomColor(maxDes, d) {
  const r = getRandom(0, 255);
  const g = getRandom(0, 255);
  const b = getRandom(0, 255);
  if (maxDes && d) {
    return `rgba(${r},${g},${b},${1 - d / maxDes})`;
  }

  return `rgb(${r},${g},${b})`;
}

class Point {
  constructor() {
    this.r = 2;
    // 随机x,y
    this.x = getRandom(0, cvs.width - this.r / 2);
    this.y = getRandom(0, cvs.height - this.r / 2);
    this.xSpeed = getRandom(-50, 50);
    this.ySpeed = getRandom(-50, 50);
    this.lastDrawTime = null;
  }

  drawPoint() {
    if (this.lastDrawTime) {
      // 计算走的时间
      const duration = (Date.now() - this.lastDrawTime) / 1000;
      // 计算走的距离
      let xDis = this.xSpeed * duration,
        yDis = this.ySpeed * duration;
      let x = this.x + xDis,
        y = this.y + yDis;
      // 边界值 超过canvas宽度或者高度 速度反向
      if (x > cvs.width - this.r / 2) {
        x = cvs.width - this.r / 2;
        this.xSpeed = -this.xSpeed;
      }
      if (y > cvs.height.r / 2) {
        y = cvs.height.r / 2;
        this.ySpeed = -this.ySpeed;
      }
      if (x < 0) {
        x = 0;
        this.xSpeed = -this.xSpeed;
      }
      if (y < 0) {
        y = 0;
        this.ySpeed = -this.ySpeed;
      }
      this.x = x;
      this.y = y;
    }
    ctx.beginPath();
    // 画圆
    ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
    // 填充样式
    ctx.fillStyle = "#fff";
    // 填充
    ctx.fill();
    this.lastDrawTime = Date.now();
  }
}
class Graph {
  constructor(pointNum = 30, maxDes = 200) {
    // 生成pointNUm个点的信息
    this.points = new Array(pointNum).fill(0).map(() => new Point());
    console.log(this.points);
    this.maxDes = maxDes;
  }
  drawGraph() {
    // 每一帧都重新调用画图
    requestAnimationFrame(() => {
      this.drawGraph();
    });
    // 画图之前清空canvas
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    for (let index = 0; index < this.points.length; index++) {
      const p1 = this.points[index];
      // 随机画点
      p1.drawPoint();
      for (let j = index + 1; j < this.points.length; j++) {
        // 根据第二个点连接线
        const p2 = this.points[j];
        const d = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
        if (d > this.maxDes) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255,255,255,${1 - d / this.maxDes})`;
        ctx.stroke();
      }
    }
  }
}
