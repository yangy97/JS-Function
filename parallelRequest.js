/*


*/
function fetch(url) {
  console.log(url);
  return url;
}
/**
 * @func
 * @Description
 * @Author: your name
 * @param {
 * array[] urls 请求数组
 * number maxNum 最大并非数量
 * }
 * @return {}
 */
function BingFa(urls, maxNum) {
  return new Promise((resovle) => {
    if (urls.length === 0) {
      resovle([]);
      return;
    }
    let index = 0; // 当前请求下标
    const result = []; // 存放请求结果
    let count = 0; // 请求完成数量
    async function request() {
      if (index === urls.length) return;
      let i = index;
      const url = urls[index];
      index++;
      try {
        const resp = await fetch(url);
        result[i] = resp;
      } catch (error) {
        result[i] = error;
      } finally {
        count++;
        console.log(result, "111");
        if (count === urls.length) {
          return resovle(result);
        }
        request();
      }
    }
    const time = Math.min(urls.length, maxNum);
    for (let index = 0; index < time; index++) {
      request();
    }
    // request()
  });
}

const urls = [2, 1, 4, 3, 5, 6];
BingFa(urls, 3).then((res) => {
  console.log(res);
});
