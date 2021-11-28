import {
   getUsefulContents
} from 'file.js';

getUsefulContents('http:///www.example.com', data => {
  getJSON(url, data => callback(JSON.parse(data)));
}


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
