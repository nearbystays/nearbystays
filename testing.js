async function theSettings(i) {
  let newArray + i = await new Array();
  let time + i = new Date()
  let asyncObject = await new Object();
  asyncObject._function = function() { }
  asyncObject._arrow = () => { }
  asyncObject._class = class { }
}

let newArray1 = new Array();
let newArray2 = new Array();
let newArray3 = new Array();

class Results {
  constructr() {
    this.t0 = 0;
  }
}

async function timer() {
  let newArray0 = new Array();
  let time0 = Date.now();
  for (let i = 0; i < 10000; i++) {
    newArray0.push(i)
  }
  console.table({
    'For Loop Time': Date.now() - time0,
    'That': 'Is All'
    });
}



(async function() {
  for await (let i of iterable) {
    newArray1.push(i)
  }
})();

async function* asyncGenerator() {
  let i = 0;
  while (i < 3) {
    yield i++;
  }
}

(async function() {
  for await (let num of asyncGenerator()) {
    console.log(num);
  }
})();


const asyncIterable = {
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      }
    };
  }
};

(async function() {
   for await (let num of asyncIterable) {
     console.log(num);
   }
})();


async function* streamAsyncIterable(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}

async function getResponseSize(url) {
  const response = await fetch(url);
  let responseSize = 0;
  for await (const chunk of streamAsyncIterable(response.body)) {
    responseSize += chunk.length;
  }

  console.log(`Response Size: ${responseSize} bytes`);
  return responseSize;
}
getResponseSize('https://jsonplaceholder.typicode.com/photos');
