function showPreview(event){
  if(event.target.files.length > 0){
    var src = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("image-upload");
    preview.src = src;
    preview.style.display = "block";
    upload(event)
  }
}

function ticker() {
  let symbols = ['TSLA', 'SP', 'DOW'];
  let animation = document.querySelector('#infinite');
  symbols.forEach(function() { });
}

function upload(event) { 
  let image = document.querySelector('#output');
  image.src = URL.createObjectURL(event.target.files[0]);
}
