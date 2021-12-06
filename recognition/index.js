var loadFile = function (event) {
  var image = document.getElementById("image");
  image.src = URL.createObjectURL(event.target.files[0]);
  localStorage.setItem('src', image.src);
};

const classifier = ml5.imageClassifier("MobileNet", modelLoaded);

function modelLoaded() {
  console.log("Model Loaded!");
}
      
function predict() {
  classifier.predict(
    document.getElementById("localImage"),
    function (err, results) {
        console.log(results[0].label);
  });
}

window.onload = () => {
  let img = document.querySelector('img');
  if (img.src) {
    localStorage.setItem('Image Source', img.src);
  }
};
