let map;
let local;

window.addEventListener('DOMContentLoaded', () => {
  locator();
});

function locator() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      local = {
        lat: p.coords.latitude,
        lng: p.coords.longitude,
      };
    });
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: local,
    zoom: 8,
  });
}

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAAdMnbeugzorXUqv735wPfnaSTt4qFWvs&callback=initMap';
script.async = true;

document.head.appendChild(script)
