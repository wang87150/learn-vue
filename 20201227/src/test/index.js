//防抖
function debounce() {
  var fb = function () {
    console.log("1111111");
  }
  var fn = createDebounce(fb, 3000);
  fn();
}

//创造防抖函数
function createDebounce() {
  var startTime = null;
  var endTime = null;
  var st = null;
  var n = '000';
  return function () {
    console.log('n', n);
  }
}

let fn = createDebounce();
fn();