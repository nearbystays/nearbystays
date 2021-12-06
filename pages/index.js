window.onload = function() {
  fn1();
  let fname = document.querySelector('#fname')
  let lname = document.querySelector('#lname')
  fname.addEventListener('change', fn2)
  lname.addEventListener('change', ln2)
};

function storeFiles() {
  let f = new File(ArrayBuffer, 'vacations');
  f.type = "html"
}

function fn1() {
  var click = document.querySelector('#submit');
  click.addEventListener('click', addData);
}

function fn2() {
  let fname = document.querySelector('#fname')
  localStorage.setItem('fname', JSON.stringify(fname));
}

function ln2() {
  let lname = document.querySelector('#lname')
  localStorage.setItem('lname', JSON.stringify(lname));
}

function fn4() {
  let restoredSession = JSON.parse(localStorage.getItem('localData'));
  let firstname = document.querySelector('#firstname');
  firstname.value = restoredSession;

  fn2()
  const v1 = document.querySelector('#firstname');
  v1.value = localStorage.getItem(localData)

  ln2()
  const v2 = document.querySelector('#lastname');
  v2.value = localStorage.getItem('localData')
}

var arr = new Array();

function addData(){
    getData();
    arr.push({
        First: document.querySelector('#fname').value,
        Last: document.querySelector('#lname').value
    });

    localStorage.setItem("localData", JSON.stringify(arr));
}

function getData(){
    var str = localStorage.getItem("localData");
    if (str!= null)
        arr = JSON.parse(str);
}

function DeleteData(){
  // localStorage.clear();
}

let a = document.querySelector('#fname')
let x = document.querySelector(`#${x}`);
let y = document.querySelector(`#${x}`);

a.addEventListener('input', fnameInput);

function fnameInput() {
  
}

// function ten() {
//   var bufferPromise = blob.arrayBuffer();
//   blob.arrayBuffer().then(buffer => console.log(buffer));
//   var buffer = await blob.arrayBuffer();
// }
