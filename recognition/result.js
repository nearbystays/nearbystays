window.onload = loader();

function loader() {
  // {'image':'div', 'par':'img', }.map((x,y) => document.createElement
  let div = document.createElement('div');
  let img = document.createElement('img');
  img.src = localStorage.getItem('src');
  image.appendChild('par');
}

const classifier = ml5.imageClassifier("MobileNet", modelLoaded);

localStorage.setItem('loader', JSON.stringify(loader));
