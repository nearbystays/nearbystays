function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/')){ continue }

    const img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

    const reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
}

function sendFiles() {
  const imgs = document.querySelectorAll(".obj");

  for (let i = 0; i < imgs.length; i++) {
    new FileUpload(imgs[i], imgs[i].file);
  }
}

function FileUpload(img, file) {
  const reader = new FileReader();
  this.ctrl = createThrobber(img);
  const xhr = new XMLHttpRequest();
  this.xhr = xhr;

  const self = this;
  this.xhr.upload.addEventListener("progress", function(e) {
        if (e.lengthComputable) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          self.ctrl.update(percentage);
        }
      }, false);

  xhr.upload.addEventListener("load", function(e){
          self.ctrl.update(100);
          const canvas = self.ctrl.ctx.canvas;
          canvas.parentNode.removeChild(canvas);
      }, false);
  xhr.open("POST", "http://demos.hacks.mozilla.org/paul/demos/resources/webservices/devnull.php");
  xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
  reader.onload = function(evt) {
    xhr.send(evt.target.result);
  };
  reader.readAsBinaryString(file);
}

function updateSize() {
  document.querySelector('#fileNum').innerHTML = this.files.length;

}
