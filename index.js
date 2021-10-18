function getLocation() {
  document.addEventListener('DOMContentLoaded', function(event) {
    alert("Welcome to Nearby Stays by Jeremy Scott");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const pos = {
          lat: parseFloat(position.coords.latitude),
          lng: parseFloat(position.coords.longitude)
        };
        mapInit(pos);
        console.log(pos);
      })
    } else { alert("Not Available"); }
  })
}

function mapInit(pos) {
  console.log
  let map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 14,
  });
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

function router(view) {
  const views = ["list", "map", "stays", "messages", "login"];
  views.forEach(function(v) { document.getElementById(v).style.display = "none"} );
  document.getElementById(views[view])style.display = block;
}

function loginView() { }
function mapView() { }
function stayView() { }
function messagesView() { }
function loginView() { }
