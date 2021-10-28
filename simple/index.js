let map;
let local;

window.addEventListener('DOMContentLoaded', () => {
  initMap();
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

var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDLgwI8A-l0MY0LxZSdUcPJZgsFSYSKG78&callback=initMap';
script.async = true;

function initMap() {
  debugger;
  map = new google.maps.Map(document.getElementById("map"), {
    center: local,
    zoom: 14,
  });
}

document.head.appendChild(script)
