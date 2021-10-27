window.addEventListener('DOMContentLoaded', function(event){
  navigator.geolocation ?
    navigator.geolocation.getCurrentPosition(showPosition) :
    alert("Geolocation is not supported by current browser");
  });

function showPosition(position) {
  var userPosition = {
    lat: position.coords.latitude,
    lng: position.coords.longitude
  };
}

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    center: userPosition,
    zoom: 14,
  });
}
