document.addEventListener('DOMContentLoaded', function(event) {
  alert("Welcome to Nearby Stays by Jeremy Scott");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Lat: " + position.coords.latitude + 
      "<br>Lon: " + position.coords.longitude 
    )})
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
// }
})

function getLocation() { }

function mainView(view) {

  let mainDiv = document.getElementById("main");
  mainDiv.style.textAlign = "center";
  let mainView = "Welcome to the " + view + " View of Nearby Stays";
  let searchIn = document.getElementById("search").value;
  
  let checkIn = document.getElementById("checkin").value;
  if (typeof checkIn === 'undefined') {
    var d = new Date();
    checkIn = d.toDateString();
  }

  var mainDivHtml = "<br>Nearby City: " + searchIn;
  checkIn = "<br>Check In Date: " + checkIn;

  mainDiv.innerHTML = mainView;
  mainDiv.innerHTML += mainDivHtml;
  mainDiv.innerHTML += checkIn;
}

function addElement () {
  const newDiv = document.createElement("div");
  const newContent = document.createTextNode("Hi there and greetings!");
  newDiv.appendChild(newContent);
  const currentDiv = document.getElementById("div1");
  document.body.insertBefore(newDiv, currentDiv);
}
