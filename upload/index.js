function showPreview(event){
  if(event.target.files.length > 0){
    var src = URL.createObjectURL(event.target.files[0]);
    var preview = document.getElementById("image-upload");
    preview.src = src;
    preview.style.display = "block";
  }
}

function ticker() {
  let symbols = ['TSLA', 'SP', 'DOW'];
  let animation = document.querySelector('#infinite');
  symbols.forEach(function() { });
}

function retrieved() { 
  let image = document.querySelector('#image')
}
