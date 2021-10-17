function getLocation() {
  document.addEventListener('DOMContentLoaded', function(event) {
    alert("Welcome to Nearby Stays by Jeremy Scott");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        console.log("Lat: " + position.coords.latitude + 
        "<br>Lon: " + position.coords.longitude 
      )})
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  })
}

function submitRes() {
  let searchResp = document.getElementById("search");
  let checkInResp = document.getElementById("checkin");
  let checkOutResp = document.getElementById("checkout");

  submitView(searchResp, checkInResp, checkOutResp)
}

function submitView(search, checkIn, checkOut) {
  let mainDiv = document.getElementById("main");
  mainDiv.style.textAlign = "center";

  var mdSearch = '<br>City: ' + search.value;
  var mdVacation = '<br>Your vacation is '+ checkIn.value + ' to ' + checkOut.value;

  mainDiv.innerHTML = mdSearch + mdVacation;
  
}

function addElement () {
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode("Hi there and greetings!");
  newDiv.appendChild(newContent);
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}

function router(view) {
  const views = ["list", "map", "stays", "messages", "login"];
  let log = views.forEach(function(x) {document.getElementById(x).style.display = "none"} );
  console.log(log);
  // views.forEach(x => document.getElementById(x).style.display = "none" );

  switch(view) {
    case 1: document.getElementById("list").style.display = "block"; break;
    case 2: document.getElementById("map").style.display = "block"; break;
    case 3: document.getElementById("stays").style.display = "block"; break;
    case 4: document.getElementById("messages").style.display = "block"; break;
    case 5: document.getElementById("login").style.display = "block"; break;
  }
}

function loginView() { }
function mapView() { }
function stayView() { }
function messagesView() { }
function loginView() { }
