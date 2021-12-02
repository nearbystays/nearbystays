function pushTime() {
  let newArray = new Array();
  let time0 = Date.now();
  for (let i = 0; i < 10000; i++) {
    newArray0.push(i)
  }
  console.table({
    'For Loop Push Time': Date.now() - time0,
    'That': 'Is All'
    });
  popTime(newArray)
}

async function popTime(filledArray) {
  let time0 = Date.now();
  for (let i = 0; i < 10000; i++) {
    filledArray.pop()
  }
  console.table({
    'Pop Time': Date.now() - time0,
    'That': 'Is All'
    });
}
